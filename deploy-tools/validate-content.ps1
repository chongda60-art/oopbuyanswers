param([string]$ProjectRoot = 'F:\seojieliu')
$ErrorActionPreference = 'Stop'

$questionsPath = Join-Path $ProjectRoot 'content\questions.json'
$homeCategoriesPath = Join-Path $ProjectRoot 'content\home-categories.json'
if (-not (Test-Path -LiteralPath $questionsPath)) { throw "Missing content source: $questionsPath" }

$questions = Get-Content -LiteralPath $questionsPath -Raw | ConvertFrom-Json
$homeCategories = if (Test-Path -LiteralPath $homeCategoriesPath) { Get-Content -LiteralPath $homeCategoriesPath -Raw | ConvertFrom-Json } else { @() }
$hiddenQuestionStatuses = @('archived','hold')
$allowedBridgeStatuses = @('approved','current')
$allowedCuricartCategories = @('Shoe','Accessories','Electronics','Clothing','Bags')
$expectedHomeCategoryOrder = @('Shoe','Accessories','Electronics','Clothing','Bags')
$forbiddenPublicCategoryLabels = @('T-Shirts','Hoodies','Jackets','Pants/Shorts','Headwear','Sets','All Product')
$requiredProductFields = @('productName','imageUrl','curicartCategory','styleOrSku','sourceType','canonicalUrl','utmUrl','matchReason','verifiedAt','status')
$requiredCategoryFields = @('categoryName','canonicalUrl','utmUrl','matchReason')
$requiredQuestionFields = @('targetKeyword','slug','title','h1','summary','quickAnswer','evidenceSummary','steps','mistakes','unknowns','faq','sources','relatedTopics','relatedQuestions','curicartBridge')
$publicQuestions = @()
$errors = New-Object System.Collections.Generic.List[string]

function Add-ValidationError([string]$Message) {
  $script:errors.Add($Message) | Out-Null
}

function Test-Text([object]$Value) {
  return ($null -ne $Value -and "$Value".Trim().Length -gt 0)
}

function ConvertTo-UtmSlug([string]$Value) {
  $slug = $Value.Trim().ToLowerInvariant()
  $slug = $slug -replace '&', ' and '
  $slug = $slug -replace '[^a-z0-9]+', '_'
  $slug = $slug -replace '^_+|_+$', ''
  return $slug
}

function Test-CuricartUtm([string]$Url, [string]$ExpectedContent) {
  try {
    if ($Url -match '\\$') { return 'URL must not end with a backslash' }
    $uri = [Uri]$Url
    if ($uri.Host -ne 'www.curicart.com') { return "host must be www.curicart.com" }
    $query = [System.Web.HttpUtility]::ParseQueryString($uri.Query)
    if ($query.Get('utm_source') -ne 'oopbuyanswers') { return 'missing utm_source=oopbuyanswers' }
    if ($query.Get('utm_medium') -ne 'referral') { return 'missing utm_medium=referral' }
    if ($query.Get('utm_campaign') -ne 'oopbuy_questions') { return 'missing utm_campaign=oopbuy_questions' }
    $content = $query.Get('utm_content')
    if (-not $content) { return 'missing utm_content' }
    if ($ExpectedContent -and $content -ne $ExpectedContent) { return "utm_content must equal $ExpectedContent" }
    return $null
  } catch {
    return "invalid URL: $Url"
  }
}

function Test-AllowedCuricartCategory([string]$Name, [string]$Context) {
  if ($allowedCuricartCategories -notcontains $Name) {
    Add-ValidationError "${Context}: category must be one of $($allowedCuricartCategories -join ', ')"
  }
  if ($forbiddenPublicCategoryLabels -contains $Name) {
    Add-ValidationError "${Context}: forbidden non-main category label $Name"
  }
}

foreach ($question in $questions) {
  foreach ($field in $requiredQuestionFields) {
    if (-not ($question.PSObject.Properties.Name -contains $field)) { Add-ValidationError "$($question.slug): missing required field $field" }
  }

  if ($question.slug -match '^product/' -or $question.slug -match '/product/') {
    Add-ValidationError "$($question.slug): local product route is not allowed"
  }

  if ($hiddenQuestionStatuses -notcontains $question.status) {
    $publicQuestions += $question
    foreach ($field in @('targetKeyword','slug','title','h1','summary','quickAnswer','evidenceSummary')) {
      if (-not (Test-Text $question.$field)) { Add-ValidationError "$($question.slug): public question has empty $field" }
    }
    foreach ($visibleField in @('summary','quickAnswer','evidenceSummary')) {
      if ($question.$visibleField -match 'The user wants') { Add-ValidationError "$($question.slug): $visibleField contains internal research wording" }
    }
  }

  $bridge = @($question.curicartBridge)
  $products = @($bridge | Where-Object { $_.type -eq 'productPreview' })
  if ($products.Count -gt 5) { Add-ValidationError "$($question.slug): productPreview exceeds max 5" }

  foreach ($item in $bridge) {
    $status = if (Test-Text $item.matchStatus) { $item.matchStatus } else { $item.status }
    $renderable = ($allowedBridgeStatuses -contains $status) -and (Test-Text $item.matchReason)

    if ($renderable) {
      if ($item.type -eq 'productPreview') {
        foreach ($field in $requiredProductFields) {
          if (-not (Test-Text $item.$field)) { Add-ValidationError "$($question.slug): renderable productPreview missing $field" }
        }
        if ($item.canonicalUrl -match '/product/' -and $item.canonicalUrl -notmatch '^https://www\.curicart\.com/') {
          Add-ValidationError "$($question.slug): productPreview cannot link to local product route"
        }
      } elseif ($item.type -eq 'categoryLink') {
        foreach ($field in $requiredCategoryFields) {
          if (-not (Test-Text $item.$field)) { Add-ValidationError "$($question.slug): renderable categoryLink missing $field" }
        }
        Test-AllowedCuricartCategory -Name "$($item.categoryName)" -Context "$($question.slug)"
      } else {
        Add-ValidationError "$($question.slug): unknown bridge type $($item.type)"
      }

      $itemSlug = if ($item.type -eq 'productPreview') { ConvertTo-UtmSlug "$($item.productName)" } else { ConvertTo-UtmSlug "$($item.categoryName)" }
      $utmError = Test-CuricartUtm -Url $item.utmUrl -ExpectedContent "question_related_$itemSlug"
      if ($utmError) { Add-ValidationError "$($question.slug): $utmError" }
    }
  }
}

foreach ($category in @($homeCategories)) {
  foreach ($field in @('slug','name','canonicalUrl','utmUrl','visual')) {
    if (-not (Test-Text $category.$field)) { Add-ValidationError "home category missing $field" }
  }
  Test-AllowedCuricartCategory -Name "$($category.name)" -Context "home category $($category.slug)"
  $utmError = Test-CuricartUtm -Url $category.utmUrl -ExpectedContent "home_category_$(ConvertTo-UtmSlug "$($category.slug)")"
  if ($utmError) { Add-ValidationError "home category $($category.slug): $utmError" }
}

$actualHomeCategoryOrder = @($homeCategories | ForEach-Object { "$($_.name)" })
if ($actualHomeCategoryOrder.Count -ne $expectedHomeCategoryOrder.Count) {
  Add-ValidationError "home categories must contain exactly $($expectedHomeCategoryOrder.Count) main categories"
} else {
  for ($i = 0; $i -lt $expectedHomeCategoryOrder.Count; $i++) {
    if ($actualHomeCategoryOrder[$i] -ne $expectedHomeCategoryOrder[$i]) {
      Add-ValidationError "home category order must be $($expectedHomeCategoryOrder -join ', ')"
      break
    }
  }
}

if ($errors.Count -gt 0) {
  throw "CONTENT_VALIDATE_FAILED`n$($errors -join "`n")"
}

Write-Output 'CONTENT_VALIDATE_OK'
Write-Output "Questions=$($questions.Count)"
Write-Output "PublicQuestions=$($publicQuestions.Count)"
Write-Output "HomeCategories=$(@($homeCategories).Count)"

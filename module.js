$('.quiz-container form').submit(e => {
  e.preventDefault()
})

//Navigation
let history = []

$('#quiz-start').click(function() {
  history.push(0)
  $('.owl-carousel').trigger('to.owl.carousel', [1])
})

$('.quiz-next-button').not("#quiz-start").not("#quiz-contact-next").click(function() {
  const cardNum = Number($(this).attr("id").replace("quiz-next-", ""))
  const allowMultiple = $(this).parent().parent().attr("data-allow-multiple")
  const answerButtons = $(this).parent().prev(".quiz-answer-section").children("button")
  let nextCard = 1
  if (answerButtons.length && allowMultiple === "false") {
    const activeButton = $(this).parent().prev(".quiz-answer-section").children(".quiz-answer-button-active")
    const nextQuestion = Number(activeButton.attr("data-next-question"))
    nextCard = nextQuestion
  } else {
    nextCard = cardNum + 1
  }
  history.push(cardNum)
  $('.owl-carousel').trigger('to.owl.carousel', [nextCard])
})

$('.quiz-back-button').click(function() {
  $('.owl-carousel').trigger('to.owl.carousel', [history[history.length -1]])
  history.pop()
})


//Answer buttons and scoring
let categories = {
  category1: 0,
  category2: 0,
  category3: 0,
  category4: 0,
  category5: 0
}

let answers = {}

$('.quiz-answer-button').each(function() {
  const cardNum = Number($(this).attr("data-card-num"))
  const allowMultiple = $(this).attr("data-allow-multiple")
  if (allowMultiple === "true") {
    answers["q" + cardNum] = []
  }
})

$('.quiz-answer-button').click(function() {
  const cardNum = Number($(this).attr("data-card-num"))
  const allowMultiple = $(this).parent().parent().attr("data-allow-multiple")
  const internalName = $(this).parent().parent().attr("data-internal-name")
  const score = Number($(this).attr("data-score"))
  const category = $(this).attr("data-scoring-category")

  if (allowMultiple === "true") {
    if ($(this).hasClass("quiz-answer-button-active")) {
      $(this).removeClass("quiz-answer-button-active")
      categories[category] -= score
      answers[internalName] = answers[internalName].filter(answer => answer !== $(this).text())
    } else {
      $(this).addClass("quiz-answer-button-active")
      categories[category] += score
      answers[internalName].push($(this).text())
    }
  } else {
    $(`#quiz-card-${cardNum} .quiz-answer-button-active`).each(function() {
      const thisAnswerScore = Number($(this).attr("data-score"))
      const thisAnswerCategory = $(this).attr("data-scoring-category")
      categories[thisAnswerCategory] -= thisAnswerScore
      $(this).removeClass("quiz-answer-button-active")
    })
    $(this).addClass("quiz-answer-button-active")
    categories[category] += score
    answers[internalName] = $(this).text()
  }
  $(`#quiz-next-${cardNum}`).removeClass("quiz-invisible")
})

$('.quiz-input').on("input", function() {
  const internalName = $(this).parent().parent().attr("data-internal-name")
  answers[internalName] = $(this).val()
  $(this).parent().next(".quiz-nav-section").find(".quiz-next-button").removeClass("quiz-invisible")
})

$('.quiz-contact-input').on("input", function() {
  const internalName = $(this).attr("name")
  answers[internalName] = $(this).val()
  let allFilled = true
  $(".quiz-contact-input").each(function() {
    if ($(this).val() === "") {
      allFilled = false
    }
  })
  if (allFilled) {
    $(this).parent().next(".quiz-nav-section").find(".quiz-next-button").removeClass("quiz-invisible")
  }
})

$('#quiz-contact-next').click(function() {
  const winner = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b)
  const resultCard = $(`.quiz-card[data-winning-category="${winner}"]`)
  const resultCardNum = resultCard.attr("id").replace("quiz-card-", "")
  const portalId = $(this).attr("data-portal-id")
  const formId = $(this).attr("data-form-id")
  const pageId = $(this).attr("data-page-id")
  const pageName = $(this).attr("data-page-name")
  submitForm(portalId, formId, pageId, pageName)
  $('.owl-carousel').trigger('to.owl.carousel', [resultCardNum])
})

//FORM SUBMISSION
function submitForm(portalId, formId, pageId, pageName) {
  const hubspotCookie = () => {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    )
  }
  
  let data = {
    fields: [],
    context: {
      hutk: hubspotCookie(),
      pageName: pageName,
      pageId: pageId
    },
    skipValidation: true
  }

  data.fields = Object.entries(answers).map(answer => {
    return { name: answer[0], value: answer[1] }
  })
  
  fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    redirect: "follow",
  })
  .then((response) => {
    if (response.redirected) {
      window.location.href = response.url
    }
    console.log("Form submitted")
  })
  .catch((error) => console.log("error", error))
}
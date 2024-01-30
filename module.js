$('.quiz-container form').submit(e => {
  e.preventDefault()
})

//Navigation
let history = []

$('#quiz-start').click(function() {
  history.push(0)
  $('.owl-carousel').trigger('to.owl.carousel', [1])
})

$('.quiz-next-button').not("#quiz-start").click(function() {
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
  const allowMultiple = $(this).attr("data-allow-multiple")
  const score = Number($(this).attr("data-score"))
  const category = $(this).attr("data-scoring-category")

  if (allowMultiple === "true") {
    if ($(this).hasClass("quiz-answer-button-active")) {
      $(this).removeClass("quiz-answer-button-active")
      categories[category] -= score
      answers["q" + cardNum] = answers["q" + cardNum].filter(answer => answer !== $(this).text())
    } else {
      $(this).addClass("quiz-answer-button-active")
      categories[category] += score
      answers["q" + cardNum].push($(this).text())
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
    answers["q" + cardNum] = $(this).text()
  }
  $(`#quiz-next-${cardNum}`).removeClass("quiz-hidden")
})

$('.quiz-input').on("input", function() {
  const cardNum = $(this).attr("id").replace("quiz-answer-", "")
  answers["q" + cardNum] = $(this).val()
  $(this).parent().next(".quiz-nav-section").find(".quiz-next-button").removeClass("quiz-hidden")
})

$('.quiz-contact-input').on("input", function() {
  const variableName = $(this).prev("label").html()
  answers[variableName] = $(this).val()
  let allFilled = true
  $(".quiz-contact-input").each(function() {
    if ($(this).val() === "") {
      allFilled = false
    }
  })
  if (allFilled) {
    $(this).parent().next(".quiz-nav-section").find(".quiz-next-button").removeClass("quiz-hidden")
  }
})
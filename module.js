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
  let nextCard = 1
  if (allowMultiple === "false") {
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

$('.quiz-answer-button').click(function() {
  const cardNum = Number($(this).attr("data-card-num"))
  const allowMultiple = $(this).attr("data-allow-multiple")
  const score = Number($(this).attr("data-score"))
  const category = $(this).attr("data-scoring-category")

  if (allowMultiple === "true") {
    if ($(this).hasClass("quiz-answer-button-active")) {
      $(this).removeClass("quiz-answer-button-active")
      categories[category] -= score
    } else {
      $(this).addClass("quiz-answer-button-active")
      categories[category] += score
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
  }
  $(`#quiz-next-${cardNum}`).removeClass("quiz-hidden")
})
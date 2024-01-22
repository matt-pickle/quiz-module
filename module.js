let history = [0]

$('.quiz-container form').submit(e => {
  e.preventDefault()
})

$('.quiz-next-button').click(function() {
  const thisCard = $(this).attr("id").replace("quiz-next-", "")
  history.push(thisCard)
})

$('#quiz-start').click(function() {
  $('.owl-carousel').trigger('to.owl.carousel', [1])
})

$('.quiz-back-button').click(function() {
  history.pop()
  $('.owl-carousel').trigger('to.owl.carousel', [history[history.length -1]])
})
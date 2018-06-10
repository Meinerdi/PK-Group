$(document).ready(function () {
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: false,
    centerMode: false,
    focusOnSelect: true
  });
});


// Tabs
$('ul.tabs__caption').each(function() {
  $(this).find('li').each(function(i) {
    $(this).click(function(){
      $(this).addClass('activeTab').siblings().removeClass('activeTab')
        .closest('section.characteristics').find('div.tabs__content').removeClass('activeTab').eq(i).addClass('activeTab');
    });
  });
});
$(() => {
	// Ширина окна для ресайза
	WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth


	// Карусель товаров
	const productsSliders = []

	$('.products .swiper').each(function (i) {
		$(this).addClass('products_s' + i)

		let options = {
			loop: true,
			speed: 500,
			spaceBetween: 16,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			breakpoints: {
				0: {
					slidesPerView: 'auto'
				},
				1280: {
					slidesPerView: 5
				}
			},
			on: {
				init: swiper => {
					setHeight($(swiper.$el).find('.product .name'))
				},
				resize: swiper => {
					$(swiper.$el).find('.product .name').height('auto')

					setHeight($(swiper.$el).find('.product .name'))
				}
			}
		}

		productsSliders.push(new Swiper('.products_s' + i, options))
	})


	// Мини всплывающие окна
	$('.mini_modal_btn').click(function (e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
			$('.mini_modal').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_btn').removeClass('active')
			$(this).addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})

	// Закрываем всплывашку при клике за её пределами
	$(document).click(e => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_btn').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})


	// Фильтр
	$('.filter .mob_btn').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('active').next().slideToggle(300)
	})


	$('.filter .label.btn').click(function (e) {
		e.preventDefault()

		let parent = $(this).closest('.item')

		$(this).toggleClass('active')
		parent.find('.data').slideToggle(300)
	})


	$('.filter .form .checkbox').click(function (e) {
		if (e.target.nodeName == 'LABEL') {
			let parent = $(this).closest('.item')

			setTimeout(() => {
				let count = parent.find('input:checked')

				parent.find('.label .count').text(count.length)

				count.length
					? parent.find('.label').addClass('selected')
					: parent.find('.label').removeClass('selected')
			})
		}
	})


	$('.filter .reset_btn').click(function (e) {
		$('.filter .form .label .count').text('')
		$('.filter .form .label').removeClass('selected')
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: "Закрыть",
		NEXT: "Следующий",
		PREV: "Предыдущий",
		MODAL: "Вы можете закрыть это модальное окно нажав клавишу ESC"
	}

	Fancybox.defaults.template = {
		closeButton: '<svg><use xlink:href="images/sprite.svg#ic_close"></use></svg>',
		spinner: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>',
		main: null
	}

	// Всплывающие окна
	$('body').on('click', '.modal_btn', function (e) {
		e.preventDefault()

		Fancybox.close()

		Fancybox.show([{
			src: $(this).data('modal'),
			type: 'inline'
		}])
	})

	// Увеличение картинки
	Fancybox.bind('.fancy_img', {
		Image: {
			zoom: false,
		},
		Thumbs: {
			autoStart: false,
		}
	})


	// Табы
	var locationHash = window.location.hash

	$('body').on('click', '.tabs button', function (e) {
		e.preventDefault()

		if (!$(this).hasClass('active')) {
			const $parent = $(this).closest('.tabs_container'),
				activeTab = $(this).data('content'),
				$activeTabContent = $(activeTab),
				level = $(this).data('level')

			$parent.find('.tabs:first button').removeClass('active')
			$parent.find('.tab_content.' + level).removeClass('active')

			$(this).addClass('active')
			$activeTabContent.addClass('active')
		}
	})

	if (locationHash && $('.tabs_container').length) {
		const $activeTab = $(`.tabs button[data-content="${locationHash}"]`),
			$activeTabContent = $(locationHash),
			$parent = $activeTab.closest('.tabs_container'),
			level = $activeTab.data('level')

		$parent.find('.tabs:first button').removeClass('active')
		$parent.find('.tab_content.' + level).removeClass('active')

		$activeTab.addClass('active')
		$activeTabContent.addClass('active')

		$('html, body').stop().animate({ scrollTop: $activeTabContent.offset().top }, 1000)
	}


	// Моб. меню
	$('header .mob_menu_btn').click((e) => {
		e.preventDefault()

		$('header .mob_menu_btn').toggleClass('active')
		$('body').toggleClass('menu_open')
		$('.mob_menu').toggleClass('show')
	})


	// Маска ввода
	$('input[type=tel]').inputmask('+7 (999) 999-99-99')

	// Фокус при клике на название поля
	$('body').on('click', '.form .label', function () {
		$(this).closest('.line').find('.input, textarea').focus()
	})

	// Очистка поля
	$('.form .clear_btn').click(function () {
		$(this).closest('.line').removeClass('error').find('.error_text').remove()
	})


	// Моб. поиск
	$('header .mob_search_btn').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('active')

		$(this).hasClass('active')
			? $('header .mob_search').fadeIn(300)
			: $('header .mob_search').fadeOut(200)
	})


	// Изменение количества товара
	const amountMinusBtns = document.querySelectorAll('.amount .minus'),
		amountPlusBtns = document.querySelectorAll('.amount .plus'),
		amountInputs = document.querySelectorAll('.amount .input')

	if (amountMinusBtns) {
		amountMinusBtns.forEach(el => {
			el.addEventListener('click', e => {
				e.preventDefault()

				let parent = el.closest('.amount'),
					input = parent.querySelector('.input'),
					inputVal = parseFloat(input.value),
					minimum = parseFloat(input.getAttribute('data-minimum')),
					step = parseFloat(input.getAttribute('data-step')),
					unit = input.getAttribute('data-unit')

				if (inputVal > minimum) input.value = inputVal - step + unit
			})
		})
	}

	if (amountPlusBtns) {
		amountPlusBtns.forEach(el => {
			el.addEventListener('click', e => {
				e.preventDefault()

				let parent = el.closest('.amount'),
					input = parent.querySelector('.input'),
					inputVal = parseFloat(input.value),
					maximum = parseFloat(input.getAttribute('data-maximum')),
					step = parseFloat(input.getAttribute('data-step')),
					unit = input.getAttribute('data-unit')

				if (inputVal < maximum) input.value = inputVal + step + unit
			})
		})
	}

	if (amountInputs) {
		amountInputs.forEach(el => {
			el.addEventListener('keydown', e => {
				let maximum = parseInt(el.getAttribute('data-maximum'))

				setTimeout(() => {
					if (el.value == '' || el.value == 0) el.maximum = parseInt(el.getAttribute('data-minimum'))
					if (el.value > maximum) el.value = maximum
				})
			})
		})
	}


	if (is_touch_device()) {
		// Закрытие моб. меню свайпом справо на лево
		let ts

		$('body').on('touchstart', (e) => { ts = e.originalEvent.touches[0].clientX })

		$('body').on('touchend', (e) => {
			let te = e.originalEvent.changedTouches[0].clientX

			if ($('body').hasClass('menu_open') && ts > te + 50) {
				// Свайп справо на лево
				$('header .mob_menu_btn').removeClass('active')
				$('body').removeClass('menu_open')
				$('.mob_menu').removeClass('show')
			} else if (ts < te - 50) {
				// Свайп слева на право
			}
		})
	}
})



$(window).on('resize', () => {
	let windowW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth

	if (typeof WW !== 'undefined' && WW != windowW) {
		// Моб. версия
		if (!firstResize) {
			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'

			if (windowW < 360) document.getElementsByTagName('meta')['viewport'].content = 'width=360, user-scalable=no'

			firstResize = true
		} else {
			firstResize = false
		}


		// Перезапись ширины окна
		WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth
	}
})
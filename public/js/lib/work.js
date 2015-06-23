function Work (el, data) {

	// console.log('el', el)

	var id = data.id,
			liked = data.liked,
			singleUrl = data.url,
			likeButton = el.querySelector('.social-item'),
			cover = el.querySelector('.cover');

	function setup () {

		console.log('cover', cover)

		cover.addEventListener('click', function () {
			console.log('click cover!')
			location.href = singleUrl
		})

		likeButton.addEventListener('click', function (event) {
			event.stopPropagation()
			console.log('click like!')
			if (!user) {
				location.href = '/auth/login/?returnTo=' + location.href
				return
			}
			if (!liked) like()
			else unLike()
		})
	}

	function like () {
		$.post('/' + user.username + '/work/like/', {idWork: id}, function (data) {
			console.log(data)
			if (data.status == 200) {
				likeButton.classList.add('active')
				liked = true
			}
		})
	}

	function unLike () {
		$.post('/' + user.username + '/work/unlike/', {idWork: id}, function (data) {
			console.log(data)
			if (data.status == 200) {
				likeButton.classList.remove('active')
				liked = false
			}
		})
	}

	setup()
}

// function mobileWork (el, data) {

// 	var id = data.id,
// 			liked = data.liked,
// 			singleUrl = data.url,
// 			likeButton = el.querySelector('.social-item');

// 	function setup () {

// 		likeButton.addEventListener('click', function () {
// 			if (!user) {
// 				location.href = '/auth/login/?returnTo=' + location.href
// 				return
// 			}
// 			if (!liked) like()
// 			else unLike()
// 		})

// 		// console.log('Mobile Browser')
// 		var mc = new Hammer.Manager(el);
// 		mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
// 		mc.add( new Hammer.Tap({ event: 'singletap' }) );
// 		mc.get('doubletap').recognizeWith('singletap');
// 		mc.get('singletap').requireFailure('doubletap');

// 		mc.on("singletap", function(ev) {
// 			location.href = singleUrl
// 		})

// 		mc.on("doubletap", function(ev) {
// 			if (!user) {
// 				location.href = '/auth/login/?returnTo=' + location.href
// 				return
// 			}
// 			if (!liked) like()
// 			else unLike()
// 		})
// 	}

// 	setup()
// }
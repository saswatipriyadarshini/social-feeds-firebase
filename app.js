firebase.auth().onAuthStateChanged(function(user) {
	var modal = document.getElementById('modal-signin');
  if (user) {
  	console.log("User Logged In");
    // User is signed in.
    modal.close();

    $('#btn-add-post').show();
    $('#btn-signout').show();
    $('#user-posts').show();
    fetchPosts();

  } else {
  	console.log("User NOT Logged In");
    
    modal.showModal();
    var button = $(modal).find('#btn-signin');
    $(button).attr('disabled', false);

    $('#btn-add-post').hide();
    $('#btn-signout').hide();
    $('#user-posts').hide();
  }
});


//Log In
$("#form-login").on("submit", function(e){
	e.preventDefault();
	var form = this;
	var email = $(form).find('#input-email').val()
	var password = $(form).find('#input-password').val();

	if(email !== ""  &&  password !== ""){

		var button = $(form).find('#btn-signin');
		$(button).attr('disabled', true);

		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

			$(button).attr('disabled', false);
			var errorCode = error.code;
      var errorMessage = error.message;

		});
	}
});


$('#btn-signout').click(function(e){
	e.preventDefault();
	firebase.auth().signOut().then(function(){
		console.log("Singed out");
	}); 
});

$('#btn-my-profile').click(function(e){
	e.preventDefault();

	//Hide drawer
	var drawer = document.querySelector('.mdl-layout');
  drawer.MaterialLayout.toggleDrawer();
	let modal = document.getElementById('modal-my-profile');
	modal.showModal();
	modal.querySelector('.close').addEventListener('click', function() {
    modal.close();
  });
});

$('#btn-add-post').click(function(e){
	e.preventDefault();
	let modal = document.getElementById('modal-add-post');
	modal.showModal();

	modal.querySelector('.close').addEventListener('click', function() {
    modal.close();
  });
});


const userPost = document.querySelector('#user-posts');
const form = document.querySelector('#new-post-form');

function renderPost(doc){
	let li = document.createElement('li');
	let title = document.createElement('h3')
	let name = document.createElement('span');
	let post = document.createElement('p');
	let deleteBtn = document.createElement('button');

	li.setAttribute('data-id', doc.id);
	title.textContent = doc.data().title;
	name.textContent  = doc.data().name;
	post.textContent  = doc.data().post;
	deleteBtn.textContent = 'Delete';

	title.id = 'title';
	name.id = 'user-name';
	post.id = 'user-post';
	deleteBtn.id = 'deleteBtn'

	li.appendChild(title)
	li.appendChild(name);
	li.appendChild(post);
	li.appendChild(deleteBtn);

	userPost.appendChild(li);

	//deleting data
	deleteBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		db.collection('posts').doc(id).delete();
	});
	fetchPosts();
}
//getting data from the datasbase
// db.collection('posts').get().then((snapshot) => {
// 	snapshot.docs.forEach(doc => {
// 		renderPosts(doc);
// 	});
// });

//saving data
$('#form-add-post').on('submit', function(e){
	e.preventDefault();
	var form = this;
	var title = $(form).find('#input-title').val();
	var name = $(form).find('#input-name').val();
	var post = $(form).find('#input-post').val();

	db.collection('posts').add({
		title: title,
		name: name,
		post: post
	});
	let modal = document.getElementById('modal-add-post');
	modal.close();

	fetchPosts();
});
	

//realtime listener
function fetchPosts(){
	db.collection('posts').orderBy('name').onSnapshot(snapshot => {
		let changes = snapshot.docChanges();
		$('#user-posts').html("");
		changes.forEach(change => {
			console.log(change.doc.data());
			if(change.type == 'added'){
				renderPost(change.doc);
			} else if (change.type == 'removed'){
				let li = userPost.querySelector('[data-id=' + change.doc.id + ']');
				userPost.removeChild(li);
			}
		})
		
	});
}

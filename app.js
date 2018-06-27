








































const userPost = document.querySelector('#user-posts');
const form = document.querySelector('#new-post-form');

function renderPosts(doc){
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

}
//getting data from the datasbase
// db.collection('posts').get().then((snapshot) => {
// 	snapshot.docs.forEach(doc => {
// 		renderPosts(doc);
// 	});
// });

//saving data
form.addEventListener('submit', (e) => {
	e.preventDefault();
	db.collection('posts').add({
		 title: form.title.value,
		 name: form.name.value,
		 post: form.post.value
	});
	form.title.value = "";
	form.name.value = "";
	form.post.value = "";

	$('#add-post-modal').hide();
});	

//realtime listener
db.collection('posts').orderBy('name').onSnapshot(snapshot => {
	let changes = snapshot.docChanges();
	changes.forEach(change => {
		console.log(change.doc.data());
		if(change.type == 'added'){
			renderPosts(change.doc);
		} else if (change.type == 'removed'){
			let li = userPost.querySelector('[data-id=' + change.doc.id + ']');
			userPost.removeChild(li);
		}
	})
	
});

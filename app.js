const userPost = document.querySelector('#user-posts');
const form = document.querySelector('#new-post-form');

function renderPosts(doc){
	let li = document.createElement('li');
	let title = document.createElement('h3')
	let name = document.createElement('h6');
	let post = document.createElement('p');
	let likeBtn = document.createElement('button');
	let deleteBtn = document.createElement('button');

	li.setAttribute('data-id', doc.id);
	title.textContent = doc.data().title;
	name.textContent  = doc.data().name;
	post.textContent  = doc.data().post;
	likeBtn.textContent = 'Like';
	deleteBtn.textContent = 'Delete';

	li.appendChild(title)
	li.appendChild(name);
	li.appendChild(post);
	li.appendChild(likeBtn);
	li.appendChild(deleteBtn);

	userPost.appendChild(li);

}

db.collection('posts').get().then((snapshot) => {
	snapshot.docs.forEach(doc => {
		renderPosts(doc);
	});
});
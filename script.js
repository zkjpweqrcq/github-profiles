const APIURL = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// start example errors
// console.log('start code');
// try {
//     console.log(a);
// } catch(err) {
//     //console.log(err.message);
// }
// console.log('middle code');
// console.log('finish code');
// end example errors

async function getUser(username) {
	try {
		const res = await fetch(APIURL + username);
		const data = await res.json();
		//console.log(data);
		createUserCard(data);
		getRepos(username);
	} catch(err) {
		if (err.response.status == 404) {
			createErrorCard('No profile with this username');
		}
		console.log(err);
	}
}

async function getRepos(username) {
	try {
		//const res = await fetch(APIURL + username + '/repos?sort=created');
		const res = await fetch(APIURL + username + '/repos');
		const data = await res.json();
		addReposToCard(data);
	} catch(err) {
	 	createErrorCard('Problem fetching repos');
	}
}

function createUserCard(user) {
	const userID = user.name || user.login;

	//const a = undefined || false || null;
	//const userBio = a ? `kek` : 'lol';
	//const userBio = a ? `<p>${a}</p>` : '';
	const userBio = user.bio ? `<p>${user.bio}</p>` : '';


	const { 
		avatar_url,  
		name,
		followers, 
		following, 
		public_repos 
	} = user;

  const cardHTML = `
    <div class="card">
    <div>
      <img src="${avatar_url}" alt="${name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${followers} <strong>Followers</strong></li>
        <li>${following} <strong>Following</strong></li>
        <li>${public_repos} <strong>Repos</strong></li>
      </ul>

      <div id="repos"></div>
    </div>
  </div>
    `;

		main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
	const cardHTML = `
		<div class="card">
			<h1>${msg}</h1>
		</div>
	`;

	main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
	const reposEl = document.getElementById('repos');

	repos
		.slice(0, 5)
		.forEach( repo => {
			const repoEl = document.createElement('a');
			repoEl.classList.add('repo');
			repoEl.href = repo.html_url;
			repoEl.target = '_blank';
			repoEl.innerHTML = repo.name;
			
			reposEl.appendChild(repoEl);
		});
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

		const user = search.value;

		if(user) {
			if(user === 'aboba') {
				createErrorCard('secret information');
			} else {
				getUser(user);
				search.value = '';
			}
		}
});


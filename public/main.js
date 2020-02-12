const routes = {
	main: createMain,
	signup: createSignUp,
	login: createLogin,
};

const application = document.getElementById('application');

const navbarItems = [
                     {tag : 'a',
                      href : '/',
                      prevent : 'main',
                      className : 'logo',
                      innerHTML : '<img src="img/headphones.png" height="40px" width="40px">'},
                     {tag : 'input',
                      className : 'search'},
                     {tag : 'button',
                      className : 'searchButton',
                      innerHTML : '<img src="img/finder.png" height="20px" width="20px">'},
                     {tag : 'a',
                      href : '/signup',
                      prevent : 'signup',
                      className : 'signup',
                      innerHTML : 'sign up'},
                     {tag : 'a',
                      href : '/login',
                      prevent : 'login',
                      className : 'login',
                      innerHTML : 'log in'}
                  ];

const navbarObj = {
                   tag : 'div',
                   class : 'navbar',
                  };

const posts = [{artist : 'Hollywood Undead',
                avatar : 'HU.jpeg',
                date : '14 февраля 2020',
                releaseType : 'альбом',
                releaseName : 'New Empire Vol. 1',
                releaseImg : 'new_empire_vol1.jpg',
                releaseDescription : `Johnny 3 Tears said about the album: "This album is our attempt at reimagining Hollywood Undead, not just a new sound for this release, but a new sound for the band altogether. Our goal from the outset was to make music that stands alone from our other albums, yet seamlessly fits with what we've made before. Building upon the old to create a new sound and a New Empire." "We approached it as if it was the first time we sat in a room to write music together. We asked 'what do we have inside of us we haven't tapped into or spoken about?' Fuck everything we've done. Let's pretend we've never made a record before and do something different. I don't want our fans to ever get comfortable with us. I want our fans to expect something different. I want them to broaden their horizons with us"`
}]

function createInput(type, text, name) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = text;
    return input;
}

function createPost() {
    const post = document.createElement('div');
    post.className = 'post';

    let rows = [];
    for (let i = 0; i < 3; i++) {
        const r = document.createElement('div');
        r.className = 'row';
        rows.push(r);
    }
    rows[0].className += ' nameRow';

    let cols0 = [];
    for (let i = 0; i < 2; i++) {
        const c = document.createElement('div');
        c.className = 'col';
        cols0.push(c);
    }
    cols0[0].className += ' col-1';
    cols0[1].className += ' col-11';

    let cols1 = [];
    for (let i = 0; i < 2; i++) {
        const c = document.createElement('div');
        c.className = 'col';
        cols1.push(c);
    }
    cols1[0].className += ' col-1';
    cols1[1].className += ' col-11';

    let cols2 = [];
    for (let i = 0; i < 2; i++) {
        const c = document.createElement('div');
        c.className = 'col';
        cols2.push(c);
    }
    cols2[0].className += ' col-3';
    cols2[1].className += ' col-9';

    const avatar = document.createElement('img');
    avatar.src = `img/${posts[0].avatar}`;
    avatar.className = 'avatar';

    const artist = document.createElement('div');
    artist.className = 'artist';
    artist.innerHTML = posts[0].artist;

    const date = document.createElement('div');
    date.className = 'date';
    date.innerHTML = posts[0].date;

    const text = document.createElement('div');
    text.className = 'text';
    text.innerHTML = 'добавили новый ' + posts[0].releaseType;

    const image = document.createElement('img');
    image.src = `img/${posts[0].releaseImg}`;
    image.className = 'releaseImage';

    const name = document.createElement('div');
    name.className = 'releaseName';
    name.innerHTML = posts[0].releaseName;

    const description = document.createElement('div');
    description.className = 'releaseDescription';
    description.innerHTML = posts[0].releaseDescription;

    cols0[0].appendChild(avatar);
    cols0[1].appendChild(artist);
    cols0[1].appendChild(date);
    cols1[1].appendChild(text);
    cols2[0].appendChild(image);
    cols2[1].appendChild(name);
    cols2[1].appendChild(description);
    rows[0].appendChild(cols0[0]);
    rows[0].appendChild(cols0[1]);
    rows[1].appendChild(cols1[0]);
    rows[1].appendChild(cols1[1]);
    rows[2].appendChild(cols2[0]);
    rows[2].appendChild(cols2[1]);
    post.appendChild(rows[0]);
    post.appendChild(rows[1]);
    post.appendChild(rows[2]);

    return post;
}

function createMain() {
    application.innerHTML = '';
    createNavbar();

    const container = document.createElement('div');
    container.className = 'container';

    const row = document.createElement('div');
    row.className = 'row';

    const col1 = document.createElement('div');
    col1.className = 'col col-1';

    const col2 = document.createElement('div');
    col2.className = 'col col-7';

    const col3 = document.createElement('div');
    col3.className = 'col col-4';

    const feed = document.createElement('div');
    feed.className = 'feed';

    for (let i = 0; i < 10; i++) {
        const post = createPost();
        feed.appendChild(post);
    }
    col2.appendChild(feed);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    container.appendChild(row);
    application.appendChild(container);
}

function createSignUp() {
    application.innerHTML = '';
    createNavbar();
	const form = document.createElement('form');

	const emailInput = createInput('email', 'Емайл', 'email');
	const passwordInput = createInput('password', 'Пароль', 'password');
	const ageInput = createInput('number', 'Возраст', 'age');

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Зарегистрироваться!';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(ageInput);
	form.appendChild(submitBtn);

	const back = document.createElement('a');
	back.href = '/';
	back.textContent = 'Назад';
	back.dataset.prevent = 'main';

	application.appendChild(form);
	application.appendChild(back);
}

function createLogin() {
    application.innerHTML = '';
    createNavbar();
    const form = document.createElement('form');

	const emailInput = createInput('email', 'Емайл', 'email');
	const passwordInput = createInput('password', 'Пароль', 'password');

	const submitBtn = document.createElement('input');
	submitBtn.type = 'submit';
	submitBtn.value = 'Авторизироваться!';

	form.appendChild(emailInput);
	form.appendChild(passwordInput);
	form.appendChild(submitBtn);

	const back = document.createElement('a');
	back.href = '/';
	back.textContent = 'Назад';
	back.dataset.prevent = 'main';

	application.appendChild(form);
	application.appendChild(back);
}

function createNavbar() {
	const navbar = document.createElement(navbarObj.tag);
    navbar.className = navbarObj.class;
    navbarItems.forEach(function (item) {
        const navbarItem = document.createElement(item.tag);
        if (item.className) {
            navbarItem.className = item.className;
        }
        if (item.href) {
            navbarItem.href = item.href;
        }
        if (item.prevent) {
            navbarItem.dataset.prevent = item.prevent;
        }
        if (item.innerHTML) {
            navbarItem.innerHTML = item.innerHTML;
        }
        if (item.margin) {
            navbarItem.margin = item.margin;
        }
        if (item.src) {
            navbarItem.src = item.src;
        }
        navbar.appendChild(navbarItem);
    });
    application.appendChild(navbar);
}

application.addEventListener('click', function (evt) {
	const {target} = evt;
	if (target instanceof HTMLAnchorElement) {
		evt.preventDefault();
		routes[target.dataset.prevent]();
	}
});

createMain();

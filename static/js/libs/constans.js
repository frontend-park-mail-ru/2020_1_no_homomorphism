export const SERVER_PATH = 'http://localhost:8081'; // 'http://89.208.199.170:8081',

export const API = '/api/v1';

export const DOM = {
    CONTENT: 'l-content',
    PLAYER: 'l-player',
    NAVBAR: 'l-navbar',
};

export const URL = {
    MAIN: '/',
    NAVBAR: 'navbar',
    PLAYER: 'player',
    LOGIN: '/login',
    SIGN_UP: '/signup',
    PROFILE: '/profile',
    PROFILE_TRACKS: '/profile/tracks',
    PROFILE_ALBUMS: '/profile/albums',
    PROFILE_PLAYLISTS: '/profile/playlists',
    PROFILE_ARTISTS: '/profile/artists',
    SETTINGS: '/settings',
};

export const TEMPLATES = {
    PROFILE: '../../../views/profile/profile.njk',
    PROFILE_TRACKS: '../../../views/profile/profile_tracks.njk',
    PROFILE_PLAYLISTS: '../../../views/profile/profile_playlists.njk',
    PROFILE_ALBUMS: '../../../views/profile/profile_albums.njk',
    PROFILE_ARTISTS: '../../../views/profile/profile_artists.njk',
    LOGIN: '../../../views/login.njk',
    SIGN_UP: '../../../views/signup.njk',
};

export const VALIDATION = {
    EMAIL_EMPTY: 'Enter email',
    EMAIL_INCORRECT: 'Incorrect email syntax',
    LOGIN_EMPTY: 'Enter login',
    LOGIN_INCORRECT: 'Login must contain at least 3 letters or numbers',
    PASS_EMPTY: 'Enter password',
    REPEAT_PASS_EMPTY: 'Repeat the password',
    PASSES_DIFF: 'Passwords must match',
    PASS_INCORRECT: 'Password must contain at least 3 letters or numbers',
    IMG_TOO_BIG: 'Max allowable size - 1Mb',
    IMG_WRONG_EXT: 'Allowable extensions - png, jpg, jpeg, gif',
    REGEX_EMAIL: '(.)+@(.)+',
    REGEX_LOGIN: '^[a-zA-Z0-9_.]{3,}$',
    REGEX_PASSWORD: '^[a-zA-Z0-9]{3,}$',
    ALLOWABLE_EXTENSIONS: ['png', 'jpg', 'jpeg', 'gif'],
};

export const LOGIN = {
    REDIRECT: 'redirect',
    INVALID: 'invalid',
    SUBMIT: 'submit',
    LOGIN_SUCCESS: 'login-success',
};

export const NAVBAR = {
    HEIGHT: 55,
    LOGIN_SUCCESS: 'login-success',
    CHECK_COOKIE: 'check-cookie',
    DRAW_COOKIE_RESULT: 'draw-cookie-result',
    RENDER_LOGGED: 'logged-in',
    RENDER_NOT_LOGGED: 'guest',
    GET_USER_DATA: 'get-user-data',
    LOGOUT_REDIRECT: 'logout-redirect',
};

export const PLAYER = {
    REDIRECT: 'redirect',
    GET_TRACKS: 'get-tracks',
    RESIZE: 'resize',
    PAUSE: 'pause',
    PLAY: 'play',
    PREVIOUS: 'previous-track',
    NEXT: 'next-track',
    REWIND: 'rewind',
    SHUFFLE: 'shuffle',
    UNSHUFFLE: 'unshuffle',
    REPEAT: 'repeat',
    REPEAT_ONE: 'repeat-one',
    UNREPEAT: 'unrepeat',
    MUTE: 'mute',
    UNMUTE: 'unmute',
    DRAW_PLAY: 'draw-play',
    DRAW_PAUSE: 'draw-pause',
    TRACK_UPDATE: 'track-update',
    DRAW_TRACKLIST: 'draw-tracklist',
    DRAW_TIMELINE: 'draw-timeline',
    DRAW_SHUFFLE: 'draw-shuffle',
    DRAW_UNSHUFLE: 'draw-unshuffle',
    DRAW_REPEAT: 'draw-repeat',
    DRAW_REPEAT_ONE: 'draw-repeat-one',
    DRAW_UNREPEAT: 'draw-unrepeat',
    DRAW_MUTE: 'draw-mute',
    DRAW_UNMUTE: 'draw-unmute',
};

export const SETTINGS = {
    GET_USER_DATA: 'get-user-data',
    RENDER_LOGGED: 'logged-in',
    AVATAR_UPLOAD: 'avatar-upload',
    SUBMIT: 'submit',
    INVALID: 'invalid',
};

export const SIGN_UP = {
    LOGIN_SUCCESS: 'login-success',
    SUBMIT: 'submit',
    INVALID: 'invalid',
};

export const PROFILE = {
    SELECTED_CLASS: 'is-touched-profile-section',
    ID_TRACKS_SECTION: 'profile-tracks-title',
    ID_PLAYLISTS_SECTION: 'profile-playlists-title',
    ID_ALBUMS_SECTION: 'profile-albums-title',
    ID_ARTISTS_SECTION: 'profile-artists-title',
    NO_ANSWER: 'no-answer',
    REDIRECT: 'redirect',
    GET_DATA: 'get-profile-data',
    RENDER_DATA: 'render-profile-data',
    CHOOSE_SECTION: 'choose-section',
    RENDER_TRACKS: 'render-profile-tracks',
    RENDER_PLAYLISTS: 'render-profile-playlists',
    RENDER_ALBUMS: 'render-profile-albums',
    RENDER_ARTISTS: 'render-profile-artists',
};


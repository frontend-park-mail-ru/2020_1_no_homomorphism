// ------------------ GENERAL ------------------
export const SERVER_PATH = 'http://localhost:8081'; // 'http://89.208.199.170:8081';
// --------------- GENERAL EVENT BUS------------------
export const REDIRECT = 'redirect';
export const NO_ANSWER = 'no-answer';
export const LOGOUT_REDIRECT = 'logout-redirect';
export const SUBMIT = 'submit';
export const INVALID = 'invalid';
export const GET_USER_DATA = 'get-user-data';
// -------------------URLS--------------------
export const URL_MAIN = '/';
export const URL_NAVBAR = 'navbar';
export const URL_PLAYER = 'player';
export const URL_LOGIN = '/login';
export const URL_SIGN_UP = '/signup';
export const URL_PROFILE = '/profile';
export const URL_PROFILE_TRACKS = '/profile/tracks';
export const URL_PROFILE_ALBUMS = '/profile/albums';
export const URL_PROFILE_PLAYLISTS = '/profile/playlists';
export const URL_PROFILE_ARTISTS = '/profile/artists';
export const URL_SETTINGS = '/settings';
// -------------VALIDATION MESSAGES -------------
export const VALID_EMAIL_EMPTY = 'Enter email';
export const VALID_EMAIL_INCORRECT = 'Incorrect email syntax';
export const VALID_LOGIN_EMPTY = 'Enter login';
export const VALID_LOGIN_INCORRECT = 'Login must contain at least 3 letters or numbers';
export const VALID_PASS_EMPTY = 'Enter password';
export const VALID_REPEAT_PASS_EMPTY = 'Repeat the password';
export const VALID_PASSES_DIFF = 'Passwords must match';
export const VALID_PASS_INCORRECT = 'Password must contain at least 3 letters or numbers';
export const VALID_IMG_TOO_BIG = 'Max allowable size - 1Mb';
export const VALID_IMG_WRONG_EXT = 'Allowable extensions - png, jpg, jpeg, gif';
export const ALLOWABLE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];
// --------------- VALIDATION REGEX------------------
export const REGEX_EMAIL = '(.)+@(.)+';
export const REGEX_LOGIN = '^[a-zA-Z0-9_.]{3,}$';
export const REGEX_PASSWORD = '^[a-zA-Z0-9]{3,}$';
// -------------------LOGIN EVENT BUS---------------------
export const LOGIN_SUCCESS = 'login-success';
// ------------------ NAV BAR EVENT BUS------------------
export const CHECK_COOKIE = 'check-cookie';
export const DRAW_COOKIE_RESULT = 'draw-cookie-result';
export const RENDER_LOGGED = 'logged-in';
export const RENDER_NOT_LOGGED = 'guest';
// ------------------ PLAYER EVENT BUS --------------------
export const GET_TRACKS = 'init';
export const PAUSE = 'pause';
export const PLAY = 'play';
export const PREVIOUS = 'previous-track';
export const NEXT = 'next-track';
export const REWIND = 'rewind';
export const SHUFFLE = 'shuffle';
export const UNSHUFFLE = 'unshuffle';
export const REPEAT = 'repeat';
export const REPEAT_ONE = 'repeat-one';
export const UNREPEAT = 'unrepeat';
export const MUTE = 'mute';
export const UNMUTE = 'unmute';
export const DRAW_PLAY = 'draw-play';
export const DRAW_PAUSE = 'draw-pause';
export const TRACK_UPDATE = 'track-update';
export const DRAW_TRACKLIST = 'draw-tracklist';
export const DRAW_TIMELINE = 'draw-timeline';
export const DRAW_SHUFFLE = 'draw-shuffle';
export const DRAW_UNSHUFLE = 'draw-unshuffle';
export const DRAW_REPEAT = 'draw-repeat';
export const DRAW_REPEAT_ONE = 'draw-repeat-one';
export const DRAW_UNREPEAT = 'draw-unrepeat';
export const DRAW_MUTE = 'draw-mute';
export const DRAW_UNMUTE = 'draw-unmute';
// ----------------- SETTINGS ----------------
export const AVATAR_UPLOAD = 'avatar-upload';
// ------------------PROFILE------------------
export const PROFILE_TEMPLATE = '../../../views/profile/profile.njk';
export const SELECTED_CLASS = 'is-touched-profile-section';
// ------------------PROFILE EVENT BUS + HTML ------------------
export const ID_TRACKS_SECTION = 'profile-tracks-title';
export const ID_PLAYLISTS_SECTION = 'profile-playlists-title';
export const ID_ALBUMS_SECTION = 'profile-albums-title';
export const ID_ARTISTS_SECTION = 'profile-artists-title';
// ------------------PROFILE EVENT BUS ------------------
export const GET_PROFILE_DATA = 'get-profile-data';
export const RENDER_PROFILE_DATA = 'render-profile-data';
export const CHOOSE_SECTION = 'choose-section';
// -
export const RENDER_PROFILE_TRACKS = 'render-profile-tracks';
export const RENDER_PROFILE_PLAYLISTS = 'render-profile-playlists';
export const RENDER_PROFILE_ALBUMS = 'render-profile-albums';
export const RENDER_PROFILE_ARTISTS = 'render-profile-artists';


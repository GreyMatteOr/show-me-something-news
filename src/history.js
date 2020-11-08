import {createBrowserHistory} from 'history';
const history = createBrowserHistory();
history.id = Math.floor( Math.random() * 10000);
export default history;

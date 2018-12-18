import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/template').default);
app.model(require('./models/schedule').default);
app.model(require('./models/course').default);
app.model(require('./models/classModels').default);
app.model(require('./models/student').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

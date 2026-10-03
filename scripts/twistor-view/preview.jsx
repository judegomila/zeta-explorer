import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import TwistorPage from '../../src/pages/TwistorPage.jsx';
import {MathModalProvider} from '../../src/components/KaTeXMath.jsx';
import '../../src/styles/app.css';
import '../../src/styles/editorial.css';
import 'katex/dist/katex.min.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><MathModalProvider><TwistorPage /></MathModalProvider></BrowserRouter>);

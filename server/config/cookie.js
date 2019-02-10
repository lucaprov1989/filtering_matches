import cookieParser from 'cookie-parser';

export const settings = {
    path: '/',
    secure: true,
    maxAge: 10000,
};



export default () => cookieParser('Wn4QxWQ6zUaXjLs4FXDGQNZ8N2gXUR9H', settings);

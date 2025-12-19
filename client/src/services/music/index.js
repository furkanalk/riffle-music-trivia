import * as RealService from './music.real.js';
import * as MockService from './music.mock.js';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const MusicService = useMock ? MockService : RealService;

if (useMock) {
    console.warn('⚠️  RIFFLE: The application is running with mocked services.');
}

export default MusicService;
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

interface FileStructure {
    [ip: string]: Directory[]
}

type Directory = string | { [directory: string]: Directory[] | string };

interface JsonResponse {
    items: [{ fileUrl: string }]
}

async function fetchData(): Promise<FileStructure> {
    try {
        const response = await fetch('https://rest-test-eight.vercel.app/api/test', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'cache-control': 'no-cache'
            }});
        const jsonData: JsonResponse = await response.json();
        const result: FileStructure = {};

        if (typeof jsonData !== 'object' || jsonData === null) {
            throw new Error('Expected a JSON object but received a different type');
        }

        for (const { fileUrl } of jsonData.items) {
            const parts = fileUrl.split("/").filter(Boolean);
            const endsWithSlash = fileUrl.endsWith('/');

            const ip = parts[1];

            if (!result[ip]) {
                result[ip] = [];
            }

            let currentLevel: Directory[] = result[ip];

            for (let i = 2; i < parts.length; i++) {
                const part = parts[i];

                const isLastPart = i === parts.length - 1;

                if (!isLastPart) {
                    const directoryName = part;

                    let existingDirectory = currentLevel.find(item => typeof item === 'object' && item[directoryName]) as Directory | undefined;

                    if (!existingDirectory) {
                        const newDirectory: { [directory: string]: Directory[] | string } = {};
                        newDirectory[directoryName] = [];
                        currentLevel.push(newDirectory);
                        existingDirectory = newDirectory;
                    }

                    if (typeof existingDirectory !== 'string') {
                        currentLevel = existingDirectory[directoryName] as Directory[];
                    }
                } else {
                    if (isLastPart && endsWithSlash) {
                        currentLevel.push({ [part]: [] });
                    } else {
                        currentLevel.push(part);
                    }
                }
            }
        }

        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

let cachedData: FileStructure | null = null;
let lastFetchTime: number = 0;

const CACHE_DURATION_ENV = process.env.CACHE_DURATION ? parseInt(process.env.CACHE_DURATION) : 100;
const CACHE_DURATION = 1000 * CACHE_DURATION_ENV;

async function cacheData(req: Request, res: Response, next: () => void) {
    const currentTime = Date.now();

    if (!cachedData || (currentTime - lastFetchTime) > CACHE_DURATION) {
        cachedData = await fetchData();
        lastFetchTime = currentTime;
    }

    next();
}

app.get('/api/files', cacheData, (req, res) => {
    res.json(cachedData);
});

// Using this we can cache the data before GET /api/files is called
async function initializeServer() {
    try {
        if (process.env.NODE_ENV !== 'test') {
            const currentTime = Date.now();
            lastFetchTime = currentTime;
            cachedData = await fetchData();

            // Start the server after caching the data
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Error initializing server:', error);
        process.exit(1);
    }
}

initializeServer();

export default app;

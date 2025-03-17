const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
        signal: controller.signal,
        // ...rest of fetch options
    });
} finally {
    clearTimeout(timeout);
}
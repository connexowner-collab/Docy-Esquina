declare module 'qz-tray' {
  const qz: {
    websocket: {
      connect: (options?: Record<string, unknown>) => Promise<void>
      disconnect: () => Promise<void>
      isActive: () => boolean
    }
    security: {
      setCertificatePromise: (fn: (resolve: (cert: string) => void, reject: (e: Error) => void) => void) => void
      setSignatureAlgorithm: (alg: string) => void
      setSignaturePromise: (fn: (toSign: string) => (resolve: (sig: string) => void, reject: (e: Error) => void) => void) => void
    }
    printers: {
      find: (query?: string) => Promise<string[]>
      getDefault: () => Promise<string>
    }
    configs: {
      create: (printer: string, options?: Record<string, unknown>) => unknown
    }
    print: (config: unknown, data: unknown[]) => Promise<void>
  }
  export default qz
}

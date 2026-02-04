declare namespace Emscripten {
    interface FileSystemType {
    }
    type EnvironmentType = "WEB" | "NODE" | "SHELL" | "WORKER";
    type JSType = "number" | "string" | "array" | "boolean";
    type TypeCompatibleWithC = number | string | any[] | boolean;
    type CIntType = "i8" | "i16" | "i32" | "i64";
    type CFloatType = "float" | "double";
    type CPointerType = "i8*" | "i16*" | "i32*" | "i64*" | "float*" | "double*" | "*";
    type CType = CIntType | CFloatType | CPointerType;
    type WebAssemblyImports = Array<{
        name: string;
        kind: string;
    }>;
    type WebAssemblyExports = Array<{
        module: string;
        name: string;
        kind: string;
    }>;
    interface CCallOpts {
        async?: boolean | undefined;
    }
    type Module<R extends keyof RuntimeMethods = never> = Pick<RuntimeMethods, R> & ModuleMethods;
    interface ModuleMethods {
        print(str: string): void;
        printErr(str: string): void;
        arguments: string[];
        environment: Emscripten.EnvironmentType;
        preInit: Array<{
            (): void;
        }>;
        preRun: Array<{
            (): void;
        }>;
        postRun: Array<{
            (): void;
        }>;
        onAbort: {
            (what: any): void;
        };
        onRuntimeInitialized: {
            (): void;
        };
        preinitializedWebGLContext: WebGLRenderingContext;
        noInitialRun: boolean;
        noExitRuntime: boolean;
        logReadFiles: boolean;
        filePackagePrefixURL: string;
        wasmBinary: ArrayBuffer;
        destroy(object: object): void;
        getPreloadedPackage(remotePackageName: string, remotePackageSize: number): ArrayBuffer;
        instantiateWasm(imports: Emscripten.WebAssemblyImports, successCallback: (module: WebAssembly.Module) => void): Emscripten.WebAssemblyExports;
        locateFile(url: string, scriptDirectory: string): string;
        onCustomMessage(event: MessageEvent): void;
        HEAP: Int32Array;
        IHEAP: Int32Array;
        FHEAP: Float64Array;
        HEAP8: Int8Array;
        HEAP16: Int16Array;
        HEAP32: Int32Array;
        HEAPU8: Uint8Array;
        HEAPU16: Uint16Array;
        HEAPU32: Uint32Array;
        HEAPF32: Float32Array;
        HEAPF64: Float64Array;
        HEAP64: BigInt64Array;
        HEAPU64: BigUint64Array;
        TOTAL_STACK: number;
        TOTAL_MEMORY: number;
        FAST_MEMORY: number;
        addOnPreRun(cb: () => void): void;
        addOnInit(cb: () => void): void;
        addOnPreMain(cb: () => void): void;
        addOnExit(cb: () => void): void;
        addOnPostRun(cb: () => void): void;
        preloadedImages: any;
        preloadedAudios: any;
        _malloc(size: number): number;
        _free(ptr: number): void;
    }
    type ModuleFactory<T extends Emscripten.Module = Emscripten.Module> = (moduleOverrides?: Partial<T>) => Promise<T>;
    namespace FileSystem {
        interface Stats {
            dev: number;
            ino: number;
            mode: number;
            nlink: number;
            uid: number;
            gid: number;
            rdev: number;
            size: number;
            blksize: number;
            blocks: number;
            atime: Date;
            mtime: Date;
            ctime: Date;
            birthtime: Date;
        }
        interface FSStream {
        }
        interface FSNode {
        }
        interface ErrnoError {
        }
        interface FS {
            lookupPath(path: string, opts?: {
                parent: boolean;
                follow: boolean;
            }): {
                path: string;
                node: FSNode;
            };
            getPath(node: FSNode): string;
            isFile(mode: number): boolean;
            isDir(mode: number): boolean;
            isLink(mode: number): boolean;
            isChrdev(mode: number): boolean;
            isBlkdev(mode: number): boolean;
            isFIFO(mode: number): boolean;
            isSocket(mode: number): boolean;
            major(dev: number): number;
            minor(dev: number): number;
            makede(ma: number, mi: number): number;
            registerDevice(dev: number, ops: any): void;
            syncfs(populate: boolean, callback: (e?: unknown) => void): void;
            syncfs(callback: (e?: unknown) => void, populate?: boolean): void;
            mount(type: Emscripten.FileSystemType, opts: object, mountpoint: string): void;
            unmount(mountpoint: string): void;
            mkdir(path: string, mode?: number): void;
            mkdev(path: string, mode?: number, dev?: number): void;
            symlink(oldpath: string, newpath: string): void;
            rename(old_path: string, new_path: string): void;
            rmdir(path: string): void;
            readdir(path: string): string[];
            unlink(path: string): void;
            readlink(path: string): string;
            stat(path: string, dontFollow?: boolean): Stats;
            lstat(path: string): Stats;
            chmod(path: string, mode: number, dontFollow?: boolean): void;
            lchmod(path: string, mode: number): void;
            fchmod(fd: number, mode: number): void;
            chown(path: string, uid: number, gid: number, dontFollow?: boolean): void;
            lchown(path: string, uid: number, gid: number): void;
            fchown(fd: number, uid: number, gid: number): void;
            truncate(path: string, len: number): void;
            ftruncate(fd: number, len: number): void;
            utime(path: string, atime: number, mtime: number): void;
            open(path: string, flags: string, mode?: number, fd_start?: number, fd_end?: number): FSStream;
            close(stream: FSStream): void;
            llseek(stream: FSStream, offset: number, whence: number): void;
            read(stream: FSStream, buffer: ArrayBufferView, offset: number, length: number, position?: number): number;
            write(stream: FSStream, buffer: ArrayBufferView, offset: number, length: number, position?: number, canOwn?: boolean): number;
            allocate(stream: FSStream, offset: number, length: number): void;
            mmap(stream: FSStream, buffer: ArrayBufferView, offset: number, length: number, position: number, prot: number, flags: number): any;
            ioctl(stream: FSStream, cmd: any, arg: any): any;
            readFile(path: string, opts: {
                encoding: "binary";
                flags?: string | undefined;
            }): Uint8Array;
            readFile(path: string, opts: {
                encoding: "utf8";
                flags?: string | undefined;
            }): string;
            readFile(path: string, opts?: {
                flags?: string | undefined;
            }): Uint8Array;
            writeFile(path: string, data: string | ArrayBufferView, opts?: {
                flags?: string | undefined;
            }): void;
            cwd(): string;
            chdir(path: string): void;
            init(input: (() => number | null) | null, output: ((c: number | null) => void) | null, error: ((c: number | null) => void) | null): void;
            createLazyFile(parent: string | FSNode, name: string, url: string, canRead: boolean, canWrite: boolean): FSNode;
            createPreloadedFile(parent: string | FSNode, name: string, url: string, canRead: boolean, canWrite: boolean, onload?: () => void, onerror?: () => void, dontCreateFile?: boolean, canOwn?: boolean): void;
            createDataFile(parent: string | FSNode, name: string, data: ArrayBufferView, canRead: boolean, canWrite: boolean, canOwn: boolean): FSNode;
        }
    }
    type StringToType<R> = R extends Emscripten.JSType ? {
        number: number;
        string: string;
        array: number[] | string[] | boolean[] | Uint8Array | Int8Array;
        boolean: boolean;
        null: null;
    }[R] : never;
    type ArgsToType<T extends Array<Emscripten.JSType | null>> = Extract<{
        [P in keyof T]: StringToType<T[P]>;
    }, any[]>;
    type ReturnToType<R extends Emscripten.JSType | null> = R extends null ? null : StringToType<Exclude<R, null>>;
    interface RuntimeMethods {
        cwrap<I extends Array<Emscripten.JSType | null> | [], R extends Emscripten.JSType | null>(ident: string, returnType: R, argTypes: I, opts?: Emscripten.CCallOpts): (...arg: Emscripten.ArgsToType<I>) => Emscripten.ReturnToType<R>;
        ccall<I extends Array<Emscripten.JSType | null> | [], R extends Emscripten.JSType | null>(ident: string, returnType: R, argTypes: I, args: ArgsToType<I>, opts?: Emscripten.CCallOpts): Emscripten.ReturnToType<R>;
        setValue(ptr: number, value: any, type: Emscripten.CType, noSafe?: boolean): void;
        getValue(ptr: number, type: Emscripten.CType, noSafe?: boolean): number;
        allocate(slab: number[] | ArrayBufferView | number, types: Emscripten.CType | Emscripten.CType[], allocator: number, ptr?: number): number;
        stackAlloc(size: number): number;
        tackSave(): number;
        tackRestore(ptr: number): void;
        UTF8ToString(ptr: number, maxBytesToRead?: number): string;
        stringToUTF8(str: string, outPtr: number, maxBytesToRead?: number): void;
        lengthBytesUTF8(str: string): number;
        allocateUTF8(str: string): number;
        allocateUTF8OnStack(str: string): number;
        UTF16ToString(ptr: number): string;
        stringToUTF16(str: string, outPtr: number, maxBytesToRead?: number): void;
        lengthBytesUTF16(str: string): number;
        UTF32ToString(ptr: number): string;
        stringToUTF32(str: string, outPtr: number, maxBytesToRead?: number): void;
        lengthBytesUTF32(str: string): number;
        intArrayFromString(stringy: string, dontAddNull?: boolean, length?: number): number[];
        intArrayToString(array: number[]): string;
        writeStringToMemory(str: string, buffer: number, dontAddNull: boolean): void;
        writeArrayToMemory(array: number[], buffer: number): void;
        writeAsciiToMemory(str: string, buffer: number, dontAddNull: boolean): void;
        addRunDependency(id: any): void;
        removeRunDependency(id: any): void;
        addFunction(func: (...args: any[]) => any, signature?: string): number;
        removeFunction(funcPtr: number): void;
        ALLOC_NORMAL: number;
        ALLOC_STACK: number;
        ALLOC_STATIC: number;
        ALLOC_DYNAMIC: number;
        ALLOC_NONE: number;
    }
}

interface Vector<T> {
    clone(): Vector<T>;
    delete(): void;
    get(index: number): T;
    push_back(value: T): void;
    resize(size: number, value?: T): void;
    set(index: number, value: T): void;
    size(): number;
}
type Pair<T1, T2> = [T1, T2];

interface FastTextCoreConstructor {
    new (): FastTextCore;
    loadModel(path: string): void;
    getNN(word: string, k: number): Vector<Pair<number, string>>;
    getAnalogies(k: number, wordA: string, wordB: string, wordC: string): Vector<Pair<number, string>>;
    getWordId(word: string): number;
    getSubwordId(subword: string): number;
    getInputMatrix(): unknown;
    getOutputMatrix(): unknown;
    getWords(): Pair<Vector<string>, Vector<number>>;
    getLabels(): Pair<Vector<string>, Vector<number>>;
    getLine(text: string): Pair<Vector<string>, Vector<string>>;
    test(filename: string, k: number, thresold: number): void;
    predict(text: string, k: number, thresold: number): Vector<Pair<number, string>>;
    getWordVector(vecFloat: Float32ArrayBridge, word: string): void;
    getSentenceVector(vecFloat: Float32ArrayBridge, text: string): void;
    getInputVector(vecFloat: Float32ArrayBridge, ind: number): void;
    train(args: unknown, jsCallback: (progress: number, loss: number, wst: number, lr: number, eta: number) => void): void;
    saveModel(filename: string): void;
    isQuant(): boolean;
}
type FastTextCore = FastTextCoreConstructor;
interface Float32ArrayBridge {
    ptr: number;
    size: number;
}
interface FastTextModule extends Emscripten.Module {
    FS: Emscripten.FileSystem.FS;
    FastText: FastTextCoreConstructor;
}
type FastTextModuleConstructor = Emscripten.ModuleFactory<FastTextModule>;

interface FastTextOptions {
    corePath?: string;
    wasmPath?: string | undefined;
}

/**
 * Convert std::vector to array
 * @param vector emscripten vector
 * @param deleteAferConvert free the vector after the conversion is complete
 */
declare const vector2Array: <T>(vector: Vector<T>, deleteAferConvert?: boolean) => Array<T>;
/**
 * Convert std::vector<std::pair<key, value>> to Map<key, value>>
 * @param vector emscripten vector
 * @param deleteAferConvert free the vector after the conversion is complete
 */
declare const kvPairVector2Map: <K, V>(vector: Vector<Pair<K, V>>, deleteAferConvert?: boolean) => Map<K, V>;
/**
 * convert std::vector<std::pair<value, key>> to Map<key, value>>
 * @param vector emscripten vector
 * @param deleteAferConvert free the vector after the conversion is complete
 */
declare const vkPairVector2Map: <K, V>(vector: Vector<Pair<V, K>>, deleteAferConvert?: boolean) => Map<K, V>;
declare const buffer2Uin8Array: (buf: Buffer) => Uint8Array<ArrayBufferLike>;
declare const fetchFile: (url: string) => Promise<ArrayBufferView>;

declare class FastText {
    /** Emscripten module */
    core: FastTextModule;
    /** Emscripten filesystem */
    fs: Emscripten.FileSystem.FS;
    private ft;
    private constructor();
    /**
     * Create a new FastText instance
     * @param [options] init options
     * @returns promise with a FastText instance
     */
    static create(options?: FastTextOptions): Promise<FastText>;
    /**
     * Load a fastText model
     * @param [model] ArrayBuffer of model
     */
    loadModel(model: ArrayBufferView): void;
    loadModel(model?: string): Promise<void>;
    private _loadModel;
    /** Detect the most probable language
     * @param text text to detect
     * @returns two or three letter language code
     */
    detect(text: string): string;
    /** Same as predict method of fastText, return a Map of probability
     *  @param text text to predict
     *  @param [k] max number of return entries, use -1 to return all
     *  @param [thresold] min possibility of return entries(0~1)
     *  @returns Map of __lable__$(lang) => probability
     */
    predict(text: string, k?: number, thresold?: number): Map<string, number>;
}

export { Emscripten, FastText, type FastTextCore, type FastTextCoreConstructor, type FastTextModule, type FastTextModuleConstructor, type Float32ArrayBridge, type Pair, type Vector, buffer2Uin8Array, fetchFile, kvPairVector2Map, vector2Array, vkPairVector2Map };

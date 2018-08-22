import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        file: 'build/widget.js',
        format: 'iife',
        globals: {
            react: 'React'
        }
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify('production'),
            ".PropTypes.string.isRequired": '',
            ".PropTypes.string": '',
            ".PropTypes.array.isRequired": '',
            ".PropTypes.array": '',
            ".PropTypes.bool": ''

        }),
        resolve({
            jsnext: true, main: true, customResolveOptions: {
                module_directory: 'node_modules'
            }
        }),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        }),
        commonjs()],
    external: ['react', 'react-dom']
};

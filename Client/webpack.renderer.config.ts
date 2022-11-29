import type { Configuration } from 'webpack'

import { rules } from './webpack.rules'
import { plugins } from './webpack.plugins'

import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'


rules.push({
	test: /\.css$/,
	use: [
		{ loader: 'style-loader' },
		{ loader: 'css-loader' },
		{
			loader: 'postcss-loader',
			options: {
				postcssOptions: {
					plugins: [tailwindcss, autoprefixer],
				},
			},
		}
	],
})

export const rendererConfig: Configuration = {
	module: {
		rules,
	},
	plugins,
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
	},
}
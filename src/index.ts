import { execSync } from 'child_process'
import os from 'os'
interface CrayonColorSupport {
	threeBitColor: boolean
	fourBitColor: boolean
	highColor: boolean
	trueColor: boolean
}

export const getWindowsVersion = (): number[] => {
	if (process.platform == 'win32') {
		const [version, , versionId] = os.release().split('.')
		return [Number(version), Number(versionId)]
	}
	return []
}

let trueColor = false
let highColor = false
let threeBitColor = false
let fourBitColor = false

export const supportedColors = (): CrayonColorSupport => ({
	trueColor,
	highColor,
	threeBitColor,
	fourBitColor,
})

const CIs = [
	'TRAVIS',
	'CIRCLECI',
	'GITHUB_ACTIONS',
	'GITLAB_CI',
	'BUILDKITE',
	'DRONE',
	'APPVEYOR',
]

export const getColorSupport = (): CrayonColorSupport => {
	if (process.env.NO_COLOR) {
		threeBitColor = fourBitColor = highColor = trueColor = false
		return supportedColors()
	}

	switch (process.env.COLORTERM) {
		case 'truecolor':
			threeBitColor = fourBitColor = highColor = trueColor = true
			return supportedColors()
		// are there other settings for that variable?
	}

	if (/-?256(color)?/gi.test(process.env.TERM || '')) {
		fourBitColor = highColor = true
		return supportedColors()
	}

	if (process.env.CI && CIs.some((CI) => !!process.env[CI])) {
		threeBitColor = fourBitColor = true
		return supportedColors()
	}

	if (process.env.COLORTERM) {
		threeBitColor = fourBitColor = true
		return supportedColors()
	}

	const winVersion = getWindowsVersion()
	if (winVersion.length) {
		// https://devblogs.microsoft.com/commandline/24-bit-color-in-the-windows-console/
		threeBitColor = fourBitColor = highColor = trueColor = winVersion[2] > 14931
		return supportedColors()
	}

	const tputColors = Number(execSync('tput colors')) || 0

	threeBitColor = tputColors >= 4
	fourBitColor = tputColors >= 8
	highColor = tputColors >= 256
	trueColor = tputColors >= 16777216

	return supportedColors()
}

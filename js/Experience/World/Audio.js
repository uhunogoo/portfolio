import { Audio, AudioListener } from 'three'
import Experience from '../Experience'


export default class AddAudio {
    constructor() {
		this.experience = new Experience()
		this.camera = this.experience.camera.instance
		this.resources = this.experience.resources.items

        // Setup
		this.listener = new AudioListener()
    }
    createAudio() {
		// add listener to camera
		this.camera.add( this.listener )
		
		// get audios from loaded files
		const sounds = [
			this.resources.enterSound,
			this.resources.openSound,
			this.resources.closeSound
		]
		const audios = sounds.map( audio => {
			const sound = new Audio( this.listener )
			sound.setBuffer( audio )
			sound.setLoop( false )
			sound.setVolume(0.5)

			return sound
		})

		// set audio object
		return {
			enterSound: audios[ 0 ],
			openSound: audios[ 1 ],
			closeSound: audios[ 2 ],
		}
    }
}

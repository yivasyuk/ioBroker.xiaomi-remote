export class Dep {
    log() {
        console.log('from admin')
    }
}

export const dep: Dep = new Dep();
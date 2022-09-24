

export function getSettingData(args: string[]): any {
    const settingData = JSON.parse(args[3])
    return {
        ...settingData
    }
}

const mapDataToOptions = (data, valueName, properyName) => {
    return data.map(item => {
        return {
            value: item[valueName], 
            text: item[properyName]
        }
    })       
}

export default mapDataToOptions
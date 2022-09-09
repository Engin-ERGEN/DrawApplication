const parseCsvToArray = async (file) => {
    const tempFile = new FileReader()
    let mapped=null;
    if (file && file?.type === "text/csv") {
        tempFile.readAsText(file, "utf8")
        
        mapped = await new Promise((resolve, reject) => {
            tempFile.onloadend = (E) => {
                const array = E.target.result.split("\n").map(line => {
                    if (line.includes(","))
                        return line.replace("\r", "").trim().split(",")
                    else
                        return line.replace("\r", "").trim().split(";")
                }).filter(line => line[0]);
    
                const header = array[0];
                if(header.length === 1 && header[0] === "name" )
                {
                    mapped = array.slice(1).map((line) => {
                    
                        return Object.assign(...line.map((value, index) => {
                            return {
                                [header[index]]: value
                            }
                        }))
                    })
                    resolve(mapped);
                }
                else{
                    reject(false);
                }
                
            }
        })
    }
  return mapped;
}

export default parseCsvToArray;
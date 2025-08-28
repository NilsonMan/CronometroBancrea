export const isEmpty = (value) => {
    try {
      if (value === null || value === undefined) return true;
  
      // si ya llega un archivo que es un File este no puede estar vacio
      if(value instanceof File) return false
  
      if (typeof value === "string") {
        return value.trim().length === 0
      }
  
      if (Array.isArray(value)) { // Arreglo
        return value?.length === 0;
      }
  
      if (typeof value === "object") { // JSON
        return Object.keys(value).length === 0;
      }
  
      return value === null || value === undefined;
    } catch (error) {
      console.error("Ocurrió un error en isEmpty", error)
      return value === null || value === undefined;
    }
  };
  
  export const isObjectAndContainsProperty = (toValidate, property) => {
    return (
      !isEmpty(toValidate) &&
      typeof toValidate === "object" &&
      property in toValidate
    );
  };

  export function dataURLtoFile(dataurl, filename) {
    try {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
  
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
  
      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      return null;
    }
  }
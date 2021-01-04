/*Calculadora. Para construir esta calculadora hay que primero "escuchar" todas las pulsaciones de teclas y luego determinar el tipo de tecla que se pulsa. En este caso, podemos usar un patrón de delegación de eventos para escuchar, ya que las teclas (teclado) son todas hijas de (calculadora).*/

/* 1. Funcion calcular(): todas las operaciones posibles (con Switch) al ingresar los dos numeros. */

const calcular = function (numero1, operador, numero2) {
    const primerNumero = parseFloat(numero1)
    const segundoNumero = parseFloat(numero2)
      switch (operador) {
        case "sumar": return primerNumero + segundoNumero;
        case "restar": return primerNumero - segundoNumero;
        case "multiplicar": return primerNumero * segundoNumero;
        case "dividir": return primerNumero / segundoNumero;
      }   
  }
  
/* 2. Funcion identificarTecla(): Hay 5 posibilidades al pulsar una tecla y   la accion a seguir. a) Un numero del 0 al 9, b) Una operacion, c) La tecla decimal (.), d) Borrar (AC) y e) Igual o resultado (=). Dependiendo de cada caso se tomara una accion (data-accion)
  Si la tecla no tiene accion, entonces es un numero (0 al 9).
  Si la accion es sumar, restar, multiplicar o dividir, entonces es un operador (+,-,X o ÷).
  Si la accion es decimal, entonces la tecla es decimal(.).
  Si la accion es borrar todo, entonces la tecla es AC.
  Por ultimo, si la accion es calcular, la tecla es igual o resultado (=).  */

  const identificarTecla = key => {
    const { accion } = key.dataset
    if (!accion) return "numero"
    if (
      accion === "sumar" ||
      accion === "restar" ||
      accion === "multiplicar" ||
      accion === "dividir"
    ) return "operador"
    return accion
  } 
  
  const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent
    const keyType = identificarTecla(key)
    const {
      firstValue,
      operador, 
      modValue,
      previousKeyType,
    } = state
      
      if (keyType === "numero") {
        return displayedNum === '0' || 
            previousKeyType === "operador" || 
            previousKeyType === "calcular"
            ? keyContent
            : displayedNum + keyContent
    }
  
    if (keyType === "decimal") {
          if (previousKeyType === "operador" || previousKeyType === "calcular") return "0."
          if (!displayedNum.includes(".")) return displayedNum + "."    
          return displayedNum 
      }
  
    if (keyType === "operador") {
      return firstValue && 
        operador && 
        previousKeyType !== "operador" &&       
        previousKeyType !== "calcular"
        ? calcular(firstValue, operador, displayedNum)
        : displayedNum      
    } 
  
    if (keyType === "borrar-todo") return 0
  
    if (keyType === "calcular") {     
    return firstValue     
      ? previousKeyType === "calcular"          
        ? calcular(displayedNum, operador, modValue)
        : calcular(firstValue, operador, displayedNum)
      : displayedNum
      }
  }
  
  const updatecalculadoraState = (key, calculadora, calculatedValue, displayedNum) => {
  
      const keyType = identificarTecla(key)
      const {
        firstValue,
        operador,
        modValue,
        previousKeyType
      } = calculadora.dataset
  
      calculadora.dataset.previousKeyType = keyType
  
    if (keyType === "operador") {
      calculadora.dataset.operador = key.dataset.accion
      calculadora.dataset.firstValue = firstValue && 
        operador && 
        previousKeyType !== "operador" && 
        previousKeyType !== "calcular"
        ? calculatedValue
        : displayedNum  
    }
  
    if (keyType === "calcular") {
      calculadora.dataset.modValue = firstValue && previousKeyType === "calcular"
          ? modValue
          : displayedNum
    }
  
    if (keyType === "borrar-todo" && key.textContent === "AC") {
          calculadora.dataset.firstValue = ""
          calculadora.dataset.operador = ""
          calculadora.dataset.modValue = ""
          calculadora.dataset.previousKeyType = ""
        } 
  } 
  // funcion para cambiar la tecla AC a CE y activar borrar pantalla.
  const updateVisualState = (key, calculadora) => {
    const keyType = identificarTecla(key)
    Array.from(key.parentNode.children).forEach(k => k.classList.remove("pulsado"))
  
    if (keyType === "operador") key.classList.add("pulsado")
  
    if (keyType === "borrar-todo" && key.textContent !== "AC") key.textContent = "AC"
  
    if (keyType !== "borrar-todo") {
      const botonBorrar = calculadora.querySelector('[data-accion="borrar-todo"]')  
      botonBorrar.textContent = "CE"
    }
  }
  
  const calculadora = document.querySelector(".calculadora");
  const keys = calculadora.querySelector(".teclado");
  const display = document.querySelector(".pantalla");
  
  keys.addEventListener("click", e => {
    if (!e.target.matches("button")) return
      const key = e.target
      const displayedNum = display.textContent;
     
      const resultString = createResultString(key, displayedNum, calculadora.dataset)
  
    display.textContent = resultString 
    updatecalculadoraState(key, calculadora, resultString, displayedNum)
    updateVisualState(key, calculadora)
      
  })
  
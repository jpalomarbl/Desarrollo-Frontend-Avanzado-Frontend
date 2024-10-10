## Declaración e inicialización de atributos

Al estar la opción _"strictPropertyInitialization"_ como _true_ en el fichero _tsconfig.json_, tal y como se recomienda en la asignatura, al declarar un atributo de una componente, como es el caso de los de la componente _register.component_, es necesario inicializarlo. Es por eso que las inicializaciones que se piden en el **Ejercicio 1** para el constructor, las hago en las declaraciones.

## Divs de error del formulario de registro

En los divs de error de este formulario, una de las condiciones para que se puedan mostrar es `(isValidForm === false)`. Utilizo esta expresión en lugar de `!isValidForm` dado que la comprobación sería _true_ cuando la variable sea _false_ o _null_, pero sólo queremos que se active cuando esta sea _false_, ya que su valor es nulo mientras el formulario no se ha intentado enviar.

TOKEN
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNmFiOGI2My1iYWI3LTQ4NjEtYWI2ZC00ODdlNDlmMmNiMmYiLCJpYXQiOjE3Mjg1NTE3NTR9.FQUVeJ3qk-M_X6twMCFwNTZQEA8jBMFVp9I4Q8DNxYw
<script>
  export let expresion = '';
</script>

<div>
  <label for="entrada">Ingresá expresión matemática:</label>
  <input
    id="entrada"
    type="text"
    bind:value={expresion}
    placeholder="Ejemplo: 2+2/5"
    autocomplete="off"
  />
</div>

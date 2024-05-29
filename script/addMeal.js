document.addEventListener('DOMContentLoaded', () => {
  const ingredientInput = document.querySelector('.ingredient');
  const addIngredientBtn = document.getElementById('addIngredient');
  const ingredientsContainer = document.getElementById('ingredientsContainer');
  const autocompleteResults = document.getElementById('autocomplete-results');

  addIngredientBtn.addEventListener('click', () => {
    const ingredientGroup = document.createElement('div');
    ingredientGroup.className = 'ingredient-group mb-3';
    ingredientGroup.innerHTML = `
      <label for="ingredient" class="form-label">Ingredient:</label>
      <input type="text" class="form-control ingredient" name="ingredients[]" required>
      <label for="portionSize" class="form-label mt-2">Portion Size:</label>
      <div class="input-group">
        <input type="number" class="form-control portionSize" name="portionSizes[]" step="any" required>
        <select class="form-select" name="portionUnits[]">
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="oz">oz</option>
          <option value="cup">cup</option>
        </select>
      </div>
    `;
    ingredientsContainer.appendChild(ingredientGroup);
    attachAutocomplete(ingredientGroup.querySelector('.ingredient'));
  });

  function attachAutocomplete(inputElement) {
    inputElement.addEventListener('input', async () => {
      const query = inputElement.value.trim();
      if (query.length > 1) {
        try {
          const response = await fetch(`/health/autocomplete?q=${query}`);
          const data = await response.json();
          showAutocompleteResults(data, inputElement);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        clearAutocompleteResults();
      }
    });
  }

  function showAutocompleteResults(results, inputElement) {
    autocompleteResults.innerHTML = results.map(result => `
      <li class="list-group-item" data-name="${result.name}">
        ${result.name}
      </li>
    `).join('');
    autocompleteResults.style.display = 'block';

    autocompleteResults.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        inputElement.value = item.getAttribute('data-name');
        clearAutocompleteResults();
      });
    });
  }

  function clearAutocompleteResults() {
    autocompleteResults.innerHTML = '';
    autocompleteResults.style.display = 'none';
  }

  attachAutocomplete(ingredientInput);
});

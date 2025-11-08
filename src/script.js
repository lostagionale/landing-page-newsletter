const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


document.addEventListener('DOMContentLoaded', () => {
    const selector = document.querySelector('.selector');
    const options = selector.querySelectorAll('.option');
    const highlight = selector.querySelector('.highlight');

    options.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            options.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            highlight.style.transform = `translateX(${index * 100}%)`;
        });
    });

    const form = document.getElementById('form');
    form.addEventListener('submit', handleSubmit);
});


async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value.trim();
  
  const activeOption = document.querySelector('.selector .option.active');
  const role = activeOption.dataset.role;

  if(!email){
    console.error('Email mancante');
    return;
  }

  const { data, error } = await supabaseClient.from('contacts').insert([{ email, role }]);

  if(error) console.error('Errore inserimento:', error);
  else{
    console.log('Iscrizione completata con successo!', data);
    form.reset();
  }
}
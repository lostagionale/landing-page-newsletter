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

  const { data: existingContacts, error: checkError } = await supabaseClient
    .from('contacts')
    .select('email')
    .eq('email', email)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Errore durante la verifica:', checkError);
    form.classList.add('hide');
    document.querySelector('.right p:last-child').classList.add('hide');
    document.querySelector('.error').style.display = 'block';
    return;
  }

  if (existingContacts) {
    console.log('Email già registrata');
    form.classList.add('hide');
    document.querySelector('.right p:last-child').classList.add('hide');
    document.querySelector('.error').style.display = 'block';
    return;
  }

  const { data, error } = await supabaseClient.from('contacts').insert([{ email, role }]);

  if(error){
    console.error('Errore inserimento:', error);
    
    form.classList.add('hide');
    document.querySelector('.right p:last-child').classList.add('hide');
    document.querySelector('.error').style.display = 'block';
  }
  else{
    console.log('Iscrizione completata con successo!', data);
    form.reset();
    
    form.classList.add('hide');
    document.querySelector('.right p:last-child').classList.add('hide');
    document.querySelector('.success').style.display = 'block';
  }
}
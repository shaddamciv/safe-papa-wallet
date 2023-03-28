const Wizard = () => {
  return (
    <div className="flex space-y-10 flex-col items-center justify-center">
       <div className="p-100 m-100">

        {/*Step 1*/}
        <div className="flex space-x-4 flex-row">
        <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
            <h2 className="card-title">Self Managed (Free!)</h2>
            <p>Create your own Portfolio, we will help you setup your vault, but the assets you choose will be decided by you!</p>
            <div className="card-actions justify-end">
            <button className="btn btn-primary">I will do it myself!</button>
            </div>
        </div>
        </div>
            
        <div className="flex flex-col w-1/2">
        <div className=" card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Common Vault (Yearly 1% fee!)</h2>
                <p>A common portfolio of Gold, Silver, Bitcoin, Ethereum and choice privacy coins. Auto rebalancing</p>
                <div className="card-actions justify-end">
                <button className="btn btn-primary">Fire and Forget!</button>
                </div>
            </div>
            </div>
            </div>
            </div>
       </div>
       <div>
    <form className="pt-100 daisyui-form-wizard">
        
        <fieldset className="daisyui-form-wizard__step" data-wizard="#1">
            
        <button className="mb-10 btn btn-wide gap-2">
            Connect Stripe
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
        </fieldset>
        <fieldset className="mb-10 daisyui-form-wizard__step" data-wizard="#2">
        <input type="range" min="0" max="100" value="40" className="range" />
        </fieldset>
        <fieldset className="daisyui-form-wizard__step" data-wizard="#3">
            
            <input type="text" id="input3" name="input3" className="mb-10 input input-bordered w-full max-w-xs" />
            
        </fieldset>

    </form>
    </div>
    <div>

    </div>
    
    <ul className="steps m-10">
            <li className="step step-primary">Choose plan</li>
            <li className="step">Create Safe</li>
            <li className="step">Create Vault</li>
            <li className="step">Set up Automations</li>
            <li className="step">Finish & Goto Dashboard</li>
        </ul>
  </div>
  );
};

export default Wizard;

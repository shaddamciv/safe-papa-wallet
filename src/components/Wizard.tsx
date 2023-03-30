import { CreateSafe } from "../components";
import { useAccount } from "wagmi";
import { SetStateAction, useState } from "react";
import Navbar from "./Navbar";
import useStorageState from "react-use-storage-state";

const Wizard = () => {
  const { isConnected } = useAccount();
  const [selfManage, setSelfManage] = useState(true);
  const [createSafeFlag, setCreateSafeFlag] = useState(true);
  const [finishStep, setFinishStep] = useState(false);
  const [safeAddress, setSafeAddress] = useState("");
  const dataToSend = { safeAddress: safeAddress, createVaultFlag: selfManage };
  //get the info for addresses of kids - later give ability to generate this
  const [numAddresses, setNumAddresses] = useState(1);
  const [addresses, setAddresses] = useStorageState('kids',[""]);

  const handleCreateSafeChange = (event: any) => {
    setCreateSafeFlag(!createSafeFlag);
  };
  const handlesSafeAddressChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSafeAddress(event.target.value);
  };
  const handleNumAddressesChange = (event: { target: { value: string } }) => {
    setNumAddresses(parseInt(event.target.value));
  };

  const handleAddressChange = (
    event: { target: { value: any } },
    index: number
  ) => {
    const newAddresses = [...addresses];
    newAddresses[index] = event.target.value;
    setAddresses(newAddresses);
  };
  const addressInputs = [];
  for (let i = 0; i < numAddresses; i++) {
    addressInputs.push(
      <div key={i}>
        <input
          id={`address-${i}`}
          type="text"
          placeholder={`0xaddress.. Child ${i + 1}`}
          value={addresses[i] || ""}
          onChange={(event) => handleAddressChange(event, i)}
          className="appearance-none input-sm border border-gray-400 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline  w-full max-w-xs"
        />
      </div>
    );
  }

  const handleCheckboxChange = (event: any) => {
    setSelfManage(true);
  };
  const handleCheckboxCommon = (event: any) => {
    setSelfManage(false);
  };
  return (
    <div className="flex space-y-10 flex-col items-center justify-center">
      <Navbar />
      <div className="p-100 m-100">
        {/*Step 1*/}
        <div className="flex space-x-4 flex-row">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Self Managed (Free!)</h2>
              <p>
                Create your own Portfolio, we will help you setup your vault,
                but the assets you choose will be decided by you!
              </p>
              <div className="card-actions justify-end">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange}
                  checked={selfManage}
                  className="checkbox"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col w-1/2">
            <div className=" card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Common Vault (Yearly 0.01% fee!)</h2>
                <p>
                  A common portfolio of Gold, Silver, Bitcoin, Ethereum and
                  choice privacy coins. <strong>Use this for the AA hackathon.</strong>
                </p>
                <div className="card-actions justify-end">
                  <input
                    type="checkbox"
                    onChange={handleCheckboxCommon}
                    checked={!selfManage}
                    className="checkbox"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* <form className="pt-100 daisyui-form-wizard">
        <fieldset className="mb-10 daisyui-form-wizard__step" data-wizard="#2">
            <input onChange={kids} type="range" min="0" max="100" value="40" className="range" />
        </fieldset>
        <fieldset className="daisyui-form-wizard__step" data-wizard="#3">
            
            <input type="text" id="input3" name="input3" className="mb-10 input input-bordered w-full max-w-xs" />
            
        </fieldset>

    </form> */}
        {/* <label className="label">
        <span className="label-text">wife/husband/friend/guardian (1)</span>
    </label>
    <input
          id="address"
          type="text"
          placeholder="0xRECOVERYADDRESS..."
          value={guardianAddress}
          onChange={handleGuardianAddressChange}
          className="appearance-none border border-gray-400 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline  w-full max-w-xs"
        /> */}

        <label
          htmlFor="num-addresses"
          className="block text-gray-700 font-bold mb-2"
        >
          How many children do you have?
        </label>
        <select
          id="num-addresses"
          value={numAddresses}
          onChange={handleNumAddressesChange}
          className="appearance-none input-sm border border-gray-400 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline  w-full max-w-xs"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          {/* add more options if needed */}
        </select>
        <label
          htmlFor="addresses"
          className="block text-gray-700 font-bold mb-2"
        >
          Addresses:
        </label>
        {addressInputs}

        <label
          htmlFor="num-addresses"
          className="block text-gray-700 font-bold mb-2"
        >
          Lock up for?
        </label>
        <input
          type="text"
          placeholder="Years"
          className="input-sm w-full border border-gray-400 rounded focus:outline-none focus:shadow-outline "
        />
        <div className="flex items-center mt-[20px] mb-[10px]">
          <input
            type="checkbox"
            onChange={handleCreateSafeChange}
            checked={createSafeFlag}
            className="checkbox-xs checkbox-primary mr-[5px]"
          />
          <small>CREATE SAFE</small>
        </div>
        <input
          id="address"
          type="text"
          placeholder="0xSAFE ADDRESS..."
          value={safeAddress}
          onChange={handlesSafeAddressChange}
          className={
            "mt-5 appearance-none border border-gray-400 rounded py-2 px-3 mb-5 leading-tight focus:outline-none focus:shadow-outline  w-full max-w-xs" +
            (createSafeFlag ? " hidden" : " ")
          }
        />
        {isConnected && <CreateSafe data={dataToSend} />}
      </div>
      <div></div>

      <ul className="steps m-10">
        <li className="step step-primary">Choose plan</li>
        <li className="step">Creating Safe</li>
        <li className="step">Setting up Vault</li>
        <li className={"step" + (finishStep ? " step-primary " : "")}>
          Finishing up!
        </li>
      </ul>
    </div>
  );
};

export default Wizard;

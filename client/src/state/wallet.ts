import { ethers } from "ethers";
import { atom } from "jotai";

import { rps, hasher } from "../assets";
const rsplsContractAddress = "0x65CE10026F0930be42557FB20D074CE56cfA69cE";
const hasherContractAddress = "0x65CE10026F0930be42557FB20D074CE56cfA69cE";

export const LoadingInitWeb3Atom = atom(false);
export const MissingMetaMaskAtom = atom(false);
export const AccountAtom = atom<string | null>(null);
export const rsplsContractAtom = atom<ethers.Contract | null>(null);
export const hasherContractAtom = atom<ethers.Contract | null>(null);

export const initWeb3Atom = atom(null, async (get, set) => {
  if (get(AccountAtom) !== null) return;
  try {
    set(LoadingInitWeb3Atom, true);
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      set(MissingMetaMaskAtom, true);
      return;
    }

    console.log("We have the ethereum object", ethereum);

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      set(AccountAtom, account);
    } else {
      console.log("No authorized account found");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractGenerator = (address: string, abi: any) =>
      new ethers.Contract(address, abi, signer);

    const rsplsContract = contractGenerator(rsplsContractAddress, rps.abi);
    const hasherContract = contractGenerator(hasherContractAddress, hasher.abi);

    set(rsplsContractAtom, rsplsContract);
    set(hasherContractAtom, hasherContract);
    set(LoadingInitWeb3Atom, false);
  } catch (error) {
    console.log(error);
  }
});

export const connectWalletAtom = atom(null, async (_, set) => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected", accounts[0]);
    set(AccountAtom, accounts[0]);
  } catch (error) {
    console.log(error);
  }
});
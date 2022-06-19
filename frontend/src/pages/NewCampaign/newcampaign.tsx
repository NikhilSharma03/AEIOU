import React, { useState } from 'react';
import {
    Container,
    ETHLabel,
    Form,
    FormHeader,
    FormHeaderTitle,
    NCDiv,
    SubmitButton,
    TextInput,
} from './newcampaign.style';
import web3 from 'web3';
import { onCreateNewContract } from './../../redux/actions/contract';
import {
    onClearContractError,
    onSetContractError,
} from './../../redux/reducers/contract';
import { useAppDispatch, useAppSelector } from './../../hooks/hooks';
import LoadingModal from '../../components/Modals/Loading/loading';
import ErrorModal from '../../components/Modals/Error/error';
import SuccessModal from '../../components/Modals/Success/success';

const NewCampaign: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [minimumContribution, setMinimumContribution] = useState<string>('');
    const [targetAmount, setTargetAmount] = useState<string>('');
    const [successMsg, setSuccessMsg] = useState<string>('');
    const dispatch = useAppDispatch();
    const userWalletAccount = useAppSelector(
        (state) => state.users.userWalletAccount
    );
    const loading = useAppSelector((state) => state.contracts.loading);
    const error = useAppSelector((state) => state.contracts.error);

    const createNewContract = (
        name,
        description,
        imageURL,
        minimumContribution,
        targetAmt,
        userWalletAccount
    ) =>
        dispatch(
            onCreateNewContract({
                name,
                description,
                imageURL,
                minimumContribution,
                userWalletAccount,
                targetAmount: targetAmt,
            })
        );

    const clearError = () => dispatch(onClearContractError());
    const setError = (msg: string) => dispatch(onSetContractError(msg));

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        // Validation
        if (
            name.trim().length === 0 ||
            description.trim().length === 0 ||
            imageUrl.trim().length === 0 ||
            minimumContribution.trim().length === 0 ||
            targetAmount.trim().length === 0
        ) {
            // Set Error
            setError('Invalid Input!!');
            return;
        }

        let minContri;
        let targetAmt;

        try {
            minContri = web3.utils.toWei(minimumContribution);
        } catch (err) {
            setError('Please enter amount in number for minimum Contribution!');
            return;
        }

        try {
            targetAmt = web3.utils.toWei(targetAmount);
        } catch (err) {
            setError('Please enter amount in number for target Amount!');
            return;
        }

        if (!userWalletAccount) {
            setError('Please connect metamask wallet to create campaign!!');
            return;
        }

        const data = {
            name,
            description,
            imageUrl,
            minimumContribution: minContri,
            targetAmount: targetAmt,
        };
        await createNewContract(
            data.name,
            data.description,
            data.imageUrl,
            data.minimumContribution,
            data.targetAmount,
            userWalletAccount
        );

        if (!error) {
            setName('');
            setDescription('');
            setImageUrl('');
            setMinimumContribution('');
            setTargetAmount('');
            setSuccessMsg('Campaign Created Successfully!');
        }
    };

    return (
        <Container>
            <ErrorModal
                content={error}
                showModal={!!error}
                closeModal={clearError}
            />
            <SuccessModal
                content={successMsg}
                showModal={!!successMsg}
                closeModal={() => setSuccessMsg('')}
            />
            <LoadingModal showModal={loading} />
            <FormHeader>
                <FormHeaderTitle>New Campaign</FormHeaderTitle>
            </FormHeader>
            <Form onSubmit={onSubmitHandler}>
                <TextInput
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextInput
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextInput
                    type="text"
                    placeholder="ImageURL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <NCDiv>
                    <TextInput
                        type="text"
                        value={minimumContribution}
                        placeholder="Minimum Contribution"
                        onChange={(e) => setMinimumContribution(e.target.value)}
                    />
                    <ETHLabel>ETH</ETHLabel>
                </NCDiv>
                <NCDiv>
                    <TextInput
                        type="text"
                        value={targetAmount}
                        placeholder="Target Amount"
                        onChange={(e) => setTargetAmount(e.target.value)}
                    />
                    <ETHLabel>ETH</ETHLabel>
                </NCDiv>
                <SubmitButton type="submit" name="Submit" />
            </Form>
        </Container>
    );
};

export default NewCampaign;

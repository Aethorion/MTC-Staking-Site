/* eslint-disable @typescript-eslint/ban-types */
import type { IdlAccountData } from '@cardinal/rewards-center'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { useFormik } from 'formik'
import { useHandleStakePoolUpdate } from 'handlers/useHandleStakePoolUpdate'
import { useWalletId } from 'hooks/useWalletId'
import * as Yup from 'yup'

import {
  bnValidationTest,
  publicKeyValidationTest,
} from './stake-pool-creation/Schema'

const stakePoolUpdateSchema = Yup.object({
  requireCollections: Yup.array()
    .of(
      Yup.string().test(
        'is-public-key',
        'Invalid collection address',
        publicKeyValidationTest
      )
    )
    .required(),
  requireCreators: Yup.array()
    .of(
      Yup.string().test(
        'is-public-key',
        'Invalid creator address',
        publicKeyValidationTest
      )
    )
    .required(),
  requiresAuthorization: Yup.boolean(),
  resetOnStake: Yup.boolean(),
  cooldownPeriodSeconds: Yup.number().optional().min(0),
  minStakeSeconds: Yup.number().optional().min(0),
  endDate: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid endDate', bnValidationTest),
})

export type StakePoolUpdateForm = Yup.InferType<typeof stakePoolUpdateSchema>

export function StakePoolUpdate({
  stakePoolData,
}: {
  stakePoolData?: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'>
}) {
  const walletId = useWalletId()
  const handleStakePoolUpdate = useHandleStakePoolUpdate()
  const initialValues: StakePoolUpdateForm = {
    requireCollections: (stakePoolData?.parsed?.allowedCollections ?? []).map(
      (pk) => pk.toString()
    ),
    requireCreators: (stakePoolData?.parsed?.allowedCreators ?? []).map((pk) =>
      pk.toString()
    ),
    requiresAuthorization:
      stakePoolData?.parsed?.requiresAuthorization ?? false,
    resetOnStake: stakePoolData?.parsed?.resetOnUnstake ?? false,
    cooldownPeriodSeconds: stakePoolData?.parsed?.cooldownSeconds ?? 0,
    minStakeSeconds: stakePoolData?.parsed?.minStakeSeconds ?? 0,
    endDate: stakePoolData?.parsed?.endDate
      ? new Date(stakePoolData?.parsed.endDate.toNumber() * 1000)
          .toISOString()
          .split('T')[0]
      : undefined,
  }
  const formState = useFormik({
    initialValues,
    onSubmit: () => {},
    validationSchema: stakePoolUpdateSchema,
  })
  const { values, errors, setFieldValue, handleChange } = formState

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'Collection Addresses []'}
            description={'Allow any NFTs with these collection addresses'}
          />
          <div
            className={`${
              values.requireCollections[0] !== '' &&
              errors.requireCollections?.at(0)
                ? 'border-red-500'
                : 'border-gray-500'
            } mb-3 flex appearance-none items-center justify-between rounded border bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
          >
            <input
              className={`mr-5 w-full bg-transparent focus:outline-none`}
              type="text"
              placeholder={'CmAy...A3fD'}
              name="requireCollections"
              value={values.requireCollections[0]}
              onChange={(e) =>
                setFieldValue('requireCollections[0]', e.target.value)
              }
            />
            <div
              className="cursor-pointer text-xs text-gray-400"
              onClick={() =>
                setFieldValue(`requireCollections`, [
                  '',
                  ...values.requireCollections,
                ])
              }
            >
              Add
            </div>
          </div>
          {values.requireCollections.map(
            (v, i) =>
              i > 0 && (
                <div
                  key={v?.toString()}
                  className={`${
                    errors.requireCollections?.at(i)
                      ? 'border-red-500'
                      : 'border-gray-500'
                  } mb-3 flex appearance-none items-center justify-between rounded border bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                >
                  <input
                    className={`mr-5 w-full bg-transparent focus:outline-none`}
                    type="text"
                    placeholder={'CmAy...A3fD'}
                    name="requireCollections"
                    value={v}
                    onChange={(e) =>
                      setFieldValue(`requireCollections[${i}]`, e.target.value)
                    }
                  />
                  <div
                    className="cursor-pointer text-xs text-gray-400"
                    onClick={() =>
                      setFieldValue(
                        `requireCollections`,
                        values.requireCollections.filter((_, ix) => ix !== i)
                      )
                    }
                  >
                    Remove
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'Creator Addresses []'}
            description={'Allow any NFTs with these creator addresses'}
          />
          <div
            className={`${
              values.requireCreators[0] !== '' && errors.requireCreators?.at(0)
                ? 'border-red-500'
                : 'border-gray-500'
            } mb-3 flex appearance-none items-center justify-between rounded border bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
          >
            <input
              className={`mr-5 w-full bg-transparent focus:outline-none`}
              type="text"
              placeholder={'CmAy...A3fD'}
              name="requireCreators"
              value={values.requireCreators[0]}
              onChange={(e) =>
                setFieldValue('requireCreators[0]', e.target.value)
              }
            />
            <div
              className="cursor-pointer text-xs text-gray-400"
              onClick={() =>
                setFieldValue(`requireCreators`, [
                  '',
                  ...values.requireCreators,
                ])
              }
            >
              Add
            </div>
          </div>
          {values.requireCreators.map(
            (v, i) =>
              i > 0 && (
                <div
                  key={v?.toString()}
                  className={`${
                    errors.requireCreators?.at(i)
                      ? 'border-red-500'
                      : 'border-gray-500'
                  } mb-3 flex appearance-none items-center justify-between rounded border bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                >
                  <input
                    className={`mr-5 w-full bg-transparent focus:outline-none`}
                    type="text"
                    placeholder={'CmAy...A3fD'}
                    name="requireCreators"
                    value={v}
                    onChange={(e) =>
                      setFieldValue(`requireCreators[${i}]`, e.target.value)
                    }
                  />
                  <div
                    className="cursor-pointer text-xs text-gray-400"
                    onClick={() =>
                      setFieldValue(
                        `requireCreators`,
                        values.requireCreators.filter((_, ix) => ix !== i)
                      )
                    }
                  >
                    Remove
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
            htmlFor="require-authorization"
          >
            NFT Mint List
          </label>
          <p className="mb-2 text-sm italic text-gray-300">
            If selected, NFTs / specific mints can be arbitrarily authorized to
            enter the pool
          </p>
          <input
            className="mb-3 cursor-pointer"
            id="require-authorization"
            type="checkbox"
            name="requiresAuthorization"
            checked={values.requiresAuthorization}
            onChange={handleChange}
          />{' '}
          <span
            className="my-auto cursor-pointer text-sm"
            onClick={() =>
              setFieldValue(
                'requiresAuthorization',
                !values.requiresAuthorization
              )
            }
          >
            Authorize specific mints
          </span>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="">
          <FormFieldTitleInput
            title={'Cooldown Period Seconds'}
            description={
              'Number of seconds to "cool down" (unstaked, but still in the pool) once user unstakes a mint'
            }
          />
          <input
            className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
            type="text"
            placeholder={'0'}
            name="cooldownPeriodSeconds"
            value={values.cooldownPeriodSeconds}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="">
          <FormFieldTitleInput
            title={'Minimum Stake Seconds'}
            description={
              'Number of seconds a mint has to stay in the pool once staked before being able to be unstaked'
            }
          />
          <input
            className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
            type="text"
            placeholder={'0'}
            name="minStakeSeconds"
            value={values.minStakeSeconds}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="">
          <FormFieldTitleInput
            title={'Pool End Date'}
            description={
              'End date for pool when staking is disabled but claiming rewards and unstaking is still enabled'
            }
          />
          <input
            className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
            type="date"
            placeholder={'None'}
            name="endDate"
            value={values.endDate}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
            htmlFor="require-authorization"
          >
            Reset on stake
          </label>
          <p className="mb-2 text-sm italic text-gray-300">
            If selected, everytime a user stakes the stake timer will reset
            rather than accumulate.
          </p>
          <input
            className="mb-3 cursor-pointer"
            id="reset-on-unstake"
            type="checkbox"
            name="resetOnStake"
            checked={values.resetOnStake}
            onChange={handleChange}
          />{' '}
          <span
            className="my-auto cursor-pointer text-sm"
            onClick={() => setFieldValue('resetOnStake', !values.resetOnStake)}
          >
            Reset on stake
          </span>
        </div>
      </div>
      <AsyncButton
        disabled={
          walletId?.toString() !== stakePoolData?.parsed.authority.toString()
        }
        onClick={async () => {
          handleStakePoolUpdate.mutate({ values })
        }}
        loading={handleStakePoolUpdate.isLoading}
        inlineLoader
        className="mx-auto mt-4 flex w-full items-center justify-center text-center"
      >
        Update
      </AsyncButton>
    </div>
  )
}
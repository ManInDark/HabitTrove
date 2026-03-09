import { addCoins, removeCoins, saveCoinsData } from '@/app/actions/data';
import { toast } from '@/hooks/use-toast';
import {
  coinsAtom,
  coinsEarnedTodayAtom,
  coinsSpentTodayAtom,
  currentUserAtom,
  currentUserIdAtom,
  settingsAtom,
  totalEarnedAtom,
  usersAtom
} from '@/lib/atoms';
import { MAX_COIN_LIMIT } from '@/lib/constants';
import { CoinsData } from '@/lib/types';
import { calculateCoinsEarnedToday, calculateCoinsSpentToday, calculateTotalEarned, calculateTotalSpent, calculateTransactionsToday, handlePermissionCheck, roundToInteger } from '@/lib/utils';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

export function useCoins(options?: { selectedUser?: string }) {
  const t = useTranslations('useCoins');
  const tCommon = useTranslations('Common');
  const [coins, setCoins] = useAtom(coinsAtom)
  const [settings] = useAtom(settingsAtom)
  const [{users}] = useAtom(usersAtom)
  const [currentUser] = useAtom(currentUserAtom)
  const [coinsData] = useAtom(coinsAtom) // All coin transactions
  const [loggedInUserId] = useAtom(currentUserIdAtom);
  const loggedInUserBalance = loggedInUserId ? coins.transactions.filter(transaction => transaction.userId === loggedInUserId).reduce((sum, transaction) => sum + transaction.amount, 0) : 0;
  const [atomCoinsEarnedToday] = useAtom(coinsEarnedTodayAtom);
  const [atomTotalEarned] = useAtom(totalEarnedAtom)
  const [atomCoinsSpentToday] = useAtom(coinsSpentTodayAtom);
  const targetUser = options?.selectedUser ? users.find(u => u.id === options.selectedUser) : currentUser
  
  const transactions = useMemo(() => {
    return coinsData.transactions.filter(t => t.userId === targetUser?.id);
  }, [coinsData, targetUser?.id]);

  const timezone = settings.system.timezone;
  const [coinsEarnedToday, setCoinsEarnedToday] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [coinsSpentToday, setCoinsSpentToday] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Calculate other metrics
    if (targetUser?.id && targetUser.id === currentUser?.id) {
      // If the target user is the currently logged-in user, use the derived atom's value
      setCoinsEarnedToday(atomCoinsEarnedToday);
      setTotalEarned(atomTotalEarned);
      setCoinsSpentToday(atomCoinsSpentToday);
      setBalance(loggedInUserBalance);
    } else if (targetUser?.id) {
      // If an admin is viewing another user, calculate their metrics manually
      const earnedToday = calculateCoinsEarnedToday(transactions, timezone);
      setCoinsEarnedToday(roundToInteger(earnedToday));

      const totalEarnedVal = calculateTotalEarned(transactions);
      setTotalEarned(roundToInteger(totalEarnedVal));

      const spentToday = calculateCoinsSpentToday(transactions, timezone);
      setCoinsSpentToday(roundToInteger(spentToday));

      const calculatedBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
      setBalance(roundToInteger(calculatedBalance));
    }
  }, [
    targetUser?.id,
    currentUser?.id,
    transactions, // Memoized: depends on allCoinsData and targetUser?.id
    timezone,
    loggedInUserBalance,
    atomCoinsEarnedToday,
    atomTotalEarned,
    atomCoinsSpentToday
  ]);

  const add = async (amount: number, description: string, note?: string) => {
    if (!handlePermissionCheck(currentUser, 'coins', 'write', tCommon)) return <></>;
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t("invalidAmountTitle"),
        description: t("invalidAmountDescription")
      })
      return <></>;
    }
    if (amount > MAX_COIN_LIMIT) {
      toast({
        title: t("invalidAmountTitle"),
        description: t("maxAmountExceededDescription", { max: MAX_COIN_LIMIT })
      })
      return <></>;
    }

    const data = await addCoins({
      amount,
      description,
      type: 'MANUAL_ADJUSTMENT',
      note,
      userId: targetUser?.id
    })
    setCoins(data)
    toast({ title: t("successTitle"), description: t("addedCoinsDescription", { amount }) })
    return data
  }

  const remove = async (amount: number, description: string, note?: string) => {
    if (!handlePermissionCheck(currentUser, 'coins', 'write', tCommon)) return <></>;
    const numAmount = Math.abs(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: t("invalidAmountTitle"),
        description: t("invalidAmountDescription")
      })
      return <></>;
    }
    if (numAmount > MAX_COIN_LIMIT) {
      toast({
        title: t("invalidAmountTitle"),
        description: t("maxAmountExceededDescription", { max: MAX_COIN_LIMIT })
      })
      return <></>;
    }

    const data = await removeCoins({
      amount: numAmount,
      description,
      type: 'MANUAL_ADJUSTMENT',
      note,
      userId: targetUser?.id
    })
    setCoins(data)
    toast({ title: t("successTitle"), description: t("removedCoinsDescription", { amount: numAmount }) })
    return data
  }

  const updateNote = async (transactionId: string, note: string) => {
    if (!handlePermissionCheck(currentUser, 'coins', 'write', tCommon)) return <></>;
    const transaction = coins.transactions.find(t => t.id === transactionId)
    if (!transaction) {
      toast({
        title: tCommon("errorTitle"),
        description: t("transactionNotFoundDescription")
      })
      return <></>;
    }

    const updatedTransaction = {
      ...transaction,
      note: note.trim() || undefined
    }

    const updatedTransactions = coins.transactions.map(t =>
      t.id === transactionId ? updatedTransaction : t
    )

    const newData: CoinsData = {
      ...coins,
      transactions: updatedTransactions
    }

    await saveCoinsData(newData)
    setCoins(newData)
    return newData
  }

  return {
    add,
    remove,
    updateNote,
    balance,
    transactions: transactions,
    coinsEarnedToday,
    totalEarned,
    totalSpent: calculateTotalSpent(coins.transactions),
    coinsSpentToday
  }
}

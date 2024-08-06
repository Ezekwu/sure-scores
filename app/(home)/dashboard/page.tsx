'use client';

import styles from './page.module.scss';
import UiIcon from '@/components/ui/Icon/UiIcon';
import Link from 'next/link';
import EventDetailsCard from '@/components/Event/EventDetailsCard/EventDetailsCard';
import { useGetLoggedInUserQuery } from '@/redux/features/Account';
import { getAuth } from 'firebase/auth';
import { formatDate } from '@/utils/helperFunctions';
import { useGetEventsQuery } from '@/redux/features/Events';

export default function Page() {
  const {data: loggedInUser, isLoading: userLoading} = useGetLoggedInUserQuery({});
  const {data: events, isLoading: eventsLoading} = useGetEventsQuery();
  const firstName = loggedInUser?.name?.split(' ')[0];
  const user = getAuth();
  const creationDate = formatDate(user.currentUser?.metadata.creationTime!, 'MMM D, YYYY');
  const currentDate = formatDate(new Date().toDateString(), 'MMM D, YYYY');
  const isLoading = userLoading || eventsLoading;

  if (isLoading) {
    return 'loading...'
  }

  return (
    <main className={styles.dashboard}>
      <div className={styles.welcome_timeRange}>
        <div className={styles.welcome}>
          <p>Welcome back, {firstName}!</p>
          <h2>Dashboard</h2>
        </div>
        <span className={styles.timeRange}>
          <UiIcon icon="Calendar" size="24" />{' '}
          <div>
            {creationDate} - {currentDate}
          </div>
        </span>
      </div>
      <section className={styles.main_layout}>
        <section className={styles.team_events_container}>
          <div className={styles.team}>
            <div className={styles.team_header}>
              <h3>Workload</h3>
              <Link href="">
                View all <UiIcon icon="CaretRight" size="24" />
              </Link>
            </div>
          </div>
          <div className={styles.events}>
            {events && events.length < 1 ? (
              <div className={styles.emptyData}>No Events</div>
            ) : (
              <div>
                <div className={styles.events_header}>
                  <h3>Nearest Events</h3>
                  <Link href="/dashboard/event-list">
                    View all <UiIcon icon="CaretRight" size="24" />
                  </Link>
                </div>
                <div className={styles.eventList}>
                  {events
                    ?.slice(0, 3)
                    .map((event) => (
                      <EventDetailsCard
                        key={event.id}
                        fullDetails={false}
                        event={event}
                        truncateTitle
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>
        <section></section>
      </section>
    </main>
  );
}

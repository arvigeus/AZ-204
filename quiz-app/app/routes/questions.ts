import type { MetaFunction } from 'react-router';
import { data, topics } from '~/lib/qa';

export const meta: MetaFunction = () => {
	return [{ title: 'Developing Solutions for Microsoft Azure: Quiz' }];
};

export const loader = async () => {
	return { questions: data, topics };
};

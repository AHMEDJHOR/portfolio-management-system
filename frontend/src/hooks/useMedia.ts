import { useQuery } from '@tanstack/react-query'
import { getMedia } from '../services/media'

export const useMediaList = () => useQuery({ queryKey: ['media'], queryFn: getMedia })
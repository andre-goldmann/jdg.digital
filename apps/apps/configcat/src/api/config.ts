import { Router } from 'express';
const router = Router();

const configData = {
  envs: [
    { value: 'default', label: 'Default' },
    { value: 'prod', label: 'Production' },
    { value: 'dev', label: 'Development' }
  ],
  services: [
    { value: 'tiims.backend', label: 'tiims.backend' },
    { value: 'tiims-account-service', label: 'tiims-account-service' },
    { value: 'tiims.storage', label: 'tiims-account-service' },
    { value: 'tiims.xprice', label: 'tiims.xprice' },
  ],
  tenants: [
    { value: 'default', label: 'Default' },
    { value: 'dtag', label: 'DTAG' },
    { value: 'dvg', label: 'DVG' },
    { value: 'nasa', label: 'NASA' },
    { value: 'renfe', label: 'Renfe' },
    { value: 'renfe-emt', label: 'Renfe-Emt' },
    { value: 'rivier', label: 'Rivier' },
  ]
};
// needs to be the same as within server.ts or it needs to be a combination of the two
router.get('/', async (req, res) => {
  return res.status(200).json(configData);
});
export default router;

# Real Public Dataset Examples

These are real, de-identified public dataset examples used to introduce medical imaging modalities on Daniel Yuan's academic website. They are not AI-generated illustrations, not images acquired by Daniel Yuan, and not his model predictions. Both images are provided under CC BY 4.0 and are excluded from any website-wide all-rights-reserved notice.

## UPENN-GBM: one brain-tumor MRI case

- File: `upenn-gbm-00002-flair.png`
- Subject: UPENN-GBM-00002; one axial FLAIR slice.
- Source: [TCIA UPENN-GBM](https://www.cancerimagingarchive.net/collection/upenn-gbm/).
- Data citation: Bakas, S., Sako, C., Akbari, H., Bilello, M., Sotiras, A., Shukla, G., Rudie, J. D., Flores Santamaria, N., Fathi Kazerooni, A., Pati, S., Rathore, S., Mamourian, E., Ha, S. M., Parker, W., Doshi, J., Baid, U., Bergman, M., Binder, Z. A., Verma, R., ... Davatzikos, C. (2021). Multi-parametric magnetic resonance imaging (mpMRI) scans for de novo Glioblastoma (GBM) patients from the University of Pennsylvania Health System (UPENN-GBM), Version 2. The Cancer Imaging Archive. [doi:10.7937/TCIA.709X-DN49](https://doi.org/10.7937/TCIA.709X-DN49).
- Publication: Bakas et al. (2022), The University of Pennsylvania glioblastoma (UPenn-GBM) cohort: advanced MRI, clinical, genomics, & radiomics. Scientific Data. [doi:10.1038/s41597-022-01560-7](https://doi.org/10.1038/s41597-022-01560-7).
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This exported PNG is shared under that license. See also [TCIA's data usage policy](https://wiki.cancerimagingarchive.net/display/Public/Data+Usage+Policies+and+Restrictions), including the prohibition on re-identification and the requirement to retain dataset and repository attribution.
- Access: the selected series was available through TCIA's official public API without an account or access request. Its series metadata explicitly lists CC BY 4.0. This is not an assertion that every brain imaging collection has the same access or reuse terms.
- Processing: a single slice selected from the source FLAIR series and converted to grayscale PNG using a documented display window. No resampling, anatomical changes, generated detail, or tumor annotation. The bright region is not a supplied segmentation mask.

## EV9V: one cardiac ultrasound example

- File: `ev9v-plax-example.jpg`
- View: parasternal long axis, labelled PLHLA in the source training split. One frame from one examination video; the cardiac phase is not asserted.
- Source: [EV9V dataset](https://huggingface.co/datasets/bgx666/EV9V) and its [author-provided dataset card](https://huggingface.co/datasets/bgx666/EV9V/blob/main/README.md).
- Creators: Bo Gou, Jicheng Zhang, Jianlong Xiong, Tao He, Bentian Liu, Hai Wu, Yijiao Wang, Yu Zhang, Yujia Yang, Yun Dai, Jian Liu, and Jie Wang.
- Reference supplied by the dataset authors: Gou et al. (2026), "Spatio-Temporal Fusion Model for Standard View Classification of Echocardiographic Videos." No journal, DOI, or publication status is inferred here.
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), explicitly declared in the dataset card. The source permits redistribution with attribution, license information and change notices. This example is not for clinical diagnosis and does not imply endorsement by the creators.
- Access: the image archive and metadata are openly accessible without an account or agreement submission. Only the first 64 KiB of the archive were retrieved via an HTTP range request, from which one 20,128-byte JPEG was extracted. The full 18.9 GB archive was not downloaded.
- Exact source member: `Images/2022-03-24_09-00-40_320x240_0/0.jpg`, from the official `Images.tar` archive. This is a source file identifier, not a claim about a patient's identity.
- Processing: JPEG copied byte-for-byte, with no cropping, resampling or pixel changes. The dataset authors had already extracted and resized frames to 320 x 240. Visible scanner information and measurement lines are part of the source image, not predictions by Daniel Yuan.
- Privacy: the dataset card states complete anonymization before processing. The selected frame was visually checked and contains no visible patient name, medical-record number or facial image.

## Provenance and display

`provenance.json` records exact source identifiers, processing, checksums, and dimensions. Raw files, local conversion scripts and rejected preview candidates are in the ignored `preview-artifacts` directory and must not be published accidentally. The website displays one MRI slice and one ultrasound frame. Do not imply endorsement by dataset creators or that these examples are Daniel Yuan's experimental results. Attribution and license details are accessible in the page's expandable image-source panel.

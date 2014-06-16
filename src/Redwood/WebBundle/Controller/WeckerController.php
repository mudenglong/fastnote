<?php 

namespace Redwood\WebBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Redwood\Common\FileToolkit;

use Imagine\Gd\Imagine;

class WeckerController extends BaseController
{    
    public function htmlAction(Request $request)
    {
        $form = $this->createFormBuilder()
            ->add('html', 'file')
            ->getForm();
        
        if($request->getMethod() == 'POST'){
            $form->bind($request);
            if($form->isValid()){
                $data = $form->getData();
                $file = $data['html'];

                $filenamePrefix = date('Y') .  date('m-d') . date('His');
                $hash = substr(md5($filenamePrefix.time()),-8);
                $ext = $file->getClientOriginalExtension();

                $filename = $filenamePrefix.$hash.'.'.$ext;
                $directory = $this->container->getParameter('redwood.upload.public_directory').'/htmlTemp';
                $file = $file->move($directory, $filename);

                $fileName = str_replace('.', '!', $file->getFilename());
  
                return $this->redirect($this->generateUrl('wecker_html_crop', array(
                    'file' => $fileName,
                    )
                ));
            }
        }

        return $this->render('RedwoodWebBundle:Wecker:show.html.twig',array(
            'form' => $form->createView(),
        ));
    }
    public function htmlCropAction(Request $request)
    {


        $filename = $request->query->get('file');
        $filename = str_replace('!', '.', $filename);

        $pictureFilePath = $this->container->getParameter('redwood.upload.public_directory') . '/htmlTemp/' . $filename;

        if($request->getMethod()=='POST')
        {
         
            $options = $request->request->all();
            $this->getFileService()->uploadHtmlPic($pictureFilePath, $options);

            return $this->createJsonResponse(array('status' => 'ok', 'html' => 'okkkk'));
   
        }

        try {
            $imagine = new Imagine();
            $image = $imagine->open($pictureFilePath);
        } catch (\Exception $e) {
            @unlink($pictureFilePath);
            return $this->createMessageResponse('error', '该文件为非图片格式文件，请重新上传。');
        }

        $naturalSize = $image->getSize();
        $scaledSize = $naturalSize->widen(1000)->heighten(1000);
        $pictureUrl = $this->container->getParameter('redwood.upload.public_url_path') . '/htmlTemp/' . $filename;

        return $this->render('RedwoodWebBundle:Wecker:html-crop.html.twig', array(
            'pictureUrl' => $pictureUrl,
            'naturalSize' => $naturalSize,
            'scaledSize' => $scaledSize,
        ));
    }

}
import FileUpload from '../FileUpload';
function OtherAttachFile() {
    return <FileUpload fieldName="otherAttachments" label="Đính kèm nếu có" multiple={true} maxSize={100} />;
}

export default OtherAttachFile;

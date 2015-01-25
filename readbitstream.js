/* Copyright (C) 2015 Miquel Àngel Farré Guiu*/

function ReadBitStream(binary) //jBinary object as input
{
    this.file = binary;
    this._bits_left  = 0;
    this._buffer = 0;

}

ReadBitStream.prototype.seekg = function(position)
{
    var offset_bits = position%8;
    var offset_bytes = position >> 3;
    this.file.seek(offset_bytes);
    this._bits_left = 0;
    this._buffer = 0;

    if(offset_bits > 0)
    {
        this.read(offset_bits);
    }
}

ReadBitStream.prototype.tellg = function()
{
    var pos = this.file.tell()*8 - this._bits_left;
    return pos;
}

ReadBitStream.prototype.read = function(n_bits_to_read)
{
    if(n_bits_to_read > 64)
        n_bits_to_read = 64;
    var to_return = 0;

    if(n_bits_to_read > 0)
    {
        var mask = 255;
        var still_to_read = n_bits_to_read;

        while( still_to_read > this._bits_left)
        {
            to_return = to_return + (this._buffer << (still_to_read - this._bits_left));
            this._buffer = this.file.read('uint8');
            still_to_read = still_to_read - this._bits_left;
            this._bits_left = 8;
        }

        this._bits_left = this._bits_left - still_to_read;
        to_return = to_return + (this._buffer >> this._bits_left);
        this._buffer = this._buffer&(mask>>(8-this._bits_left));
    }
    return to_return;
}
